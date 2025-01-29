import { firebaseDb as db } from "@/lib/services/firebase";
import {
  collection,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { filterData } from "@/lib/utils";
import {
  CreateStallInput,
  GetStallByNameParams,
  GetStallParams,
  GetStallsParams,
  UpdateStallInput,
} from "@/lib/models/params/stall.params";
import {
  stallMapper,
  stallNamesMapper,
  stallsMapper,
} from "@/lib/models/mappers/stall.mapper";
import { StallStatus } from "@/lib/models/enums/StallStatus";

const collectionName = "stalls";

export const getStallsCount = async () => {
  try {
    const coll = collection(db, collectionName);
    const q = query(coll, where("isActive", "==", true));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log("count: ", count);

    return count;
  } catch (error) {
    console.error("Error fetching rooms count:", error);
    throw new Error("Failed to fetch rooms count");
  }
};

export const getStalls = async ({
  pageSize = 10,
  last,
  first,
  direction,
  roomName,
  companyName,
}: GetStallsParams) => {
  try {
    const filters: any[] = [];

    filters.push(where("isActive", "==", true));

    if (roomName) {
      filters.push(where("roomName", "==", roomName));
    }

    if (companyName) {
      filters.push(where("companyName", "==", companyName));
    }

    const collectionRef = collection(db, collectionName);
    let q;

    if (direction === "next" && last) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("stallId", "desc"),
        startAfter(last),
        limit(pageSize)
      );
    } else if (direction === "prev" && first) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("stallId", "desc"),
        endBefore(first),
        limitToLast(pageSize)
      );
    } else {
      q = query(
        collectionRef,
        ...filters,
        orderBy("stallId", "desc"),
        limit(pageSize)
      );
    }

    const querySnap = await getDocs(q);

    return stallsMapper(querySnap);
  } catch (error) {
    console.error("Error fetching stalls:", error);
    throw new Error("Failed to fetch stalls");
  }
};

export const getStallsNames = async ({
  roomName,
  companyName,
}: GetStallsParams) => {
  try {
    const filters: any[] = [];

    filters.push(where("isActive", "==", true));

    if (roomName) {
      filters.push(where("roomName", "==", roomName));
    }

    if (companyName) {
      filters.push(where("companyName", "==", companyName));
    }

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...filters, orderBy("name", "asc"));

    const querySnap = await getDocs(q);

    return stallNamesMapper(querySnap);
  } catch (error) {
    console.error("Error fetching stalls names:", error);
    throw new Error("Failed to fetch stalls names");
  }
};

export const getStall = async ({ stallId: stallId }: GetStallParams) => {
  try {
    if (!stallId) {
      throw new Error("stallId  required");
    }
    const docRef = doc(db, collectionName, stallId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().deletedAt) {
      return null;
    }

    console.log("Document data:", docSnap.data());
    return stallMapper(docSnap);
  } catch (error) {
    console.error("Error fetching stall:", error);
    throw new Error("Failed to fetch stall");
  }
};

export const getStallByName = async ({ name }: GetStallByNameParams) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("name", "==", name));
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return stallMapper(querySnap.docs[0]);
  } catch (error: any) {
    console.error("Error fetching stall by name:", error);
    throw new Error(`Failed to fetch stall by name: ${error.message}`);
  }
};

export const createStall = async (data: CreateStallInput) => {
  try {
    const existingRoom = await getStallByName({ name: data.name });
    if (existingRoom) {
      throw new Error("stall already exists");
    }

    const docRef = doc(collection(db, collectionName));

    await setDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      stallId: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      stallStatus: StallStatus.TEMP_CLOSED,
      isActive: true,
    });

    console.log("Stall created at: ", docRef.id);

    return getStall({ stallId: docRef.id });
  } catch (e: any) {
    console.error("Error creating stall: ", e);
    throw new Error(`Failed to create stall: ${e.message}`);
  }
};

export const createStallsBatch = async (data: CreateStallInput[]) => {
  const batch = writeBatch(db);
  const existingStalls: CreateStallInput[] = [];

  try {
    for (const stallData of data) {
      const existingStall = await getStallByName({ name: stallData.name });
      if (existingStall) {
        existingStalls.push(stallData);
        continue; // Skip to the next stall
      }

      const docRef = doc(collection(db, "stalls"));
      batch.set(docRef, {
        ...filterData(stallData),
        id: docRef.id,
        stallId: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        stallStatus: StallStatus.TEMP_CLOSED,
        isActive: true,
      });
    }

    await batch.commit();
    console.log("Batch stall creation successful");

    // Optionally, return the created stalls
    const createdStalls = await Promise.all(
      data
        .filter(
          (stallData) =>
            !existingStalls.some((existing) => existing.name === stallData.name)
        )
        .map(async (stallData) => {
          const stall = await getStallByName({ name: stallData.name });
          return stall;
        })
    );

    return { createdStalls, existingStalls };
  } catch (e: any) {
    console.error("Error creating stall batch: ", e);
    throw new Error(`Failed to create stall batch: ${e.message}`);
  }
};

export const updateStall = async (data: UpdateStallInput) => {
  try {
    const docRef = doc(db, collectionName, data.stallId);
    await updateDoc(docRef, {
      ...filterData(data),
      stallId: docRef.id,
      updatedAt: serverTimestamp(),
    });
    const updatedDocSnap = await getDoc(docRef);

    if (!updatedDocSnap.exists()) {
      throw new Error("Stall doesn't exist or did not update");
    }

    return getStall({ stallId: updatedDocSnap.id });
  } catch (e) {
    console.error("Error updating stall: ", e);
  }
};

export const deleteStall = async (stallId: string) => {
  try {
    const docRef = doc(db, collectionName, stallId);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      isActive: false,
    });
    // await deleteDoc(docRef);
    console.log("Stall deleted: ", docRef.id);

    return docRef.id;
  } catch (e: any) {
    console.error("Error deleting stall: ", e);
    throw new Error(`Failed to delete stall: ${e.message}`);
  }
};
