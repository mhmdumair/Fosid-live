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
  CreateRoomInput,
  GetRoomByNameParams,
  GetRoomParams,
  GetRoomsParams,
  UpdateRoomInput,
} from "@/lib/models/params/room.params";
import { roomMapper, roomsMapper } from "@/lib/models/mappers/room.mapper";

const collectionName = "rooms";

export const getRoomsCount = async () => {
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

export const getRooms = async ({
  pageSize = 10,
  last,
  first,
  direction,
}: GetRoomsParams) => {
  try {
    const filters: any[] = [];

    filters.push(where("isActive", "==", true));

    const collectionRef = collection(db, collectionName);
    let q;

    if (direction === "next" && last) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("name", "asc"),
        startAfter(last),
        limit(pageSize)
      );
    } else if (direction === "prev" && first) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("name", "asc"),
        endBefore(first),
        limitToLast(pageSize)
      );
    } else {
      q = query(
        collectionRef,
        ...filters,
        orderBy("name", "asc"),
        limit(pageSize)
      );
    }

    const querySnap = await getDocs(q);

    return roomsMapper(querySnap);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error("Failed to fetch rooms");
  }
};

export const getRoom = async ({ roomId, name }: GetRoomParams) => {
  try {
    if (!roomId && !name) {
      throw new Error("roomId or name is required");
    } else if (!roomId && name) {
      return await getRoomByName({ name });
    }

    const docRef = doc(db, collectionName, roomId);
    const docSnap = await getDoc(docRef);

    // deleted At check
    if (!docSnap.exists() || docSnap.data().deletedAt) {
      return null;
    }

    console.log("Document data:", docSnap.data());
    return roomMapper(docSnap);
  } catch (error) {
    console.error("Error fetching room:", error);
    throw new Error("Failed to fetch room");
  }
};

export const getRoomByName = async ({ name }: GetRoomByNameParams) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("name", "==", name));
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return roomMapper(querySnap.docs[0]);
  } catch (error: any) {
    console.error("Error fetching room by name:", error);
    throw new Error(`Failed to fetch room by name: ${error.message}`);
  }
};

export const createRoom = async (data: CreateRoomInput) => {
  try {
    const existingRoom = await getRoomByName({ name: data.name });
    if (existingRoom) {
      throw new Error("Room already exists");
    }

    const docRef = doc(collection(db, collectionName));

    await setDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      roomId: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    });

    console.log("Room created at: ", docRef.id);

    return getRoom({ roomId: docRef.id });
  } catch (e: any) {
    console.error("Error creating room: ", e);
    throw new Error(`Failed to create room: ${e.message}`);
  }
};

export const createRoomsBatch = async (data: CreateRoomInput[]) => {
  const batch = writeBatch(db);
  const existingRooms: CreateRoomInput[] = [];

  try {
    for (const roomData of data) {
      const existingRoom = await getRoomByName({ name: roomData.name });
      if (existingRoom) {
        existingRooms.push(roomData);
        continue; // Skip to the next room
      }

      const docRef = doc(collection(db, "rooms"));
      batch.set(docRef, {
        ...filterData(roomData),
        id: docRef.id,
        roomId: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      });
    }

    await batch.commit();
    console.log("Batch room creation successful");

    // Optionally, return the created rooms
    const createdRooms = await Promise.all(
      data
        .filter(
          (roomData) =>
            !existingRooms.some((existing) => existing.name === roomData.name)
        )
        .map(async (roomData) => {
          const room = await getRoomByName({ name: roomData.name });
          return room;
        })
    );

    return { createdRooms, existingRooms };
  } catch (e: any) {
    console.error("Error creating room batch: ", e);
    throw new Error(`Failed to create room batch: ${e.message}`);
  }
};

export const updateRoom = async (data: UpdateRoomInput) => {
  try {
    const docRef = doc(db, collectionName, data.roomId);
    await updateDoc(docRef, {
      ...filterData(data),
      roomId: docRef.id,
      updatedAt: serverTimestamp(),
    });
    const updatedDocSnap = await getDoc(docRef);

    if (!updatedDocSnap.exists()) {
      throw new Error("Room doesn't exist or did not update");
    }

    return getRoom({ roomId: updatedDocSnap.id });
  } catch (e) {
    console.error("Error updating room: ", e);
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    const docRef = doc(db, collectionName, roomId);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      isActive: false,
    });
    // await deleteDoc(docRef);
    console.log("Room deleted: ", docRef.id);

    return docRef.id;
  } catch (e: any) {
    console.error("Error deleting room: ", e);
    throw new Error(`Failed to delete room: ${e.message}`);
  }
};
