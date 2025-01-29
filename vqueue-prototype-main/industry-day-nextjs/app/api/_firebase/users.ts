import { firebaseDb as db } from "@/lib/services/firebase";
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  companyAdminMapper,
  companyAdminsMapper,
  roomAdminMapper,
  roomAdminsMapper,
  studentMapper,
  studentsMapper,
  userMapper,
  usersMapper,
} from "@/lib/models/mappers/user.mapper";
import {
  CreateUserInput,
  UpdateUserInput,
  GetUserByEmailParams,
  GetUserParams,
  GetUsersParams,
  GetUserByLinkedAuthIdParams,
} from "@/lib/models/params/user.params";
import { UserUnion } from "@/lib/models/unions/user.union";
import { filterData } from "@/lib/utils";

const collectionName = "users";

function unitRoleSwitch({
  role,
  docSnap,
}: {
  role?: string;
  docSnap: DocumentSnapshot<DocumentData, DocumentData>;
}): UserUnion {
  switch (role) {
    case "admin":
      return userMapper(docSnap);
    case "student":
      return studentMapper(docSnap);
    case "companyAdmin":
      return companyAdminMapper(docSnap);
    case "roomAdmin":
      return roomAdminMapper(docSnap);
    default:
      return userMapper(docSnap);
  }
}

function batchRoleSwitch({
  role,
  querySnap,
}: {
  role?: string;
  querySnap: QuerySnapshot<DocumentData, DocumentData>;
}): UserUnion[] {
  switch (role) {
    case "admin":
      return usersMapper(querySnap);
    case "student":
      return studentsMapper(querySnap);
    case "companyAdmin":
      return companyAdminsMapper(querySnap);
    case "roomAdmin":
      return roomAdminsMapper(querySnap);
    default:
      return usersMapper(querySnap);
  }
}

export const getUsersCount = async () => {
  try {
    const coll = collection(db, collectionName);
    const q = query(coll, where("isActive", "==", true));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log("count: ", count);

    return count;
  } catch (error) {
    console.error("Error fetching users count:", error);
    throw new Error("Failed to fetch users count");
  }
};

export const getUsers = async ({
  role,
  pageSize = 10,
  last,
  first,
  direction,
}: GetUsersParams) => {
  try {
    const filters: any[] = [];

    // Add filters based on provided filters
    if (role) {
      filters.push(where("role", "==", role));
    }

    filters.push(where("isActive", "==", true));

    console.log({ pageSize, last, first, direction });

    const collectionRef = collection(db, collectionName);
    let q;

    if (direction === "next" && last) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("uid", "desc"),
        startAfter(last),
        limit(pageSize)
      );
    } else if (direction === "prev" && first) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("uid", "desc"),
        endBefore(first),
        limitToLast(pageSize)
      );
    } else {
      q = query(
        collectionRef,
        ...filters,
        orderBy("uid", "desc"),
        limit(pageSize)
      );
    }

    const querySnap = await getDocs(q);

    return batchRoleSwitch({ role, querySnap });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUser = async ({ uid }: GetUserParams) => {
  try {
    if (!uid) {
      throw new Error("userId is required");
    }

    const docRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().deletedAt) {
      return null;
    }

    console.log("Document data:", docSnap.data());
    const role = docSnap.data().role;
    return unitRoleSwitch({ role, docSnap });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const getUserByEmail = async ({ email }: GetUserByEmailParams) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("email", "==", email));
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return unitRoleSwitch({
      role: querySnap.docs[0].data().role,
      docSnap: querySnap.docs[0],
    });
  } catch (error: any) {
    console.error("Error fetching user by email:", error);
    throw new Error(`Failed to fetch user by email: ${error.message}`);
  }
};

export const getUserByAuthId = async ({
  linkedAuthId,
}: GetUserByLinkedAuthIdParams) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("linkedAuthId", "==", linkedAuthId));
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return unitRoleSwitch({
      role: querySnap.docs[0].data().role,
      docSnap: querySnap.docs[0],
    });
  } catch (error: any) {
    console.error("Error fetching user by auth id:", error);
    throw new Error(`Failed to fetch user by auth id: ${error.message}`);
  }
};

export const createUser = async (data: CreateUserInput) => {
  try {
    const existingUser = await getUserByEmail({ email: data.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const docRef = doc(collection(db, collectionName));

    await setDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      uid: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    });

    console.log("User created at: ", docRef.id);

    return getUser({ uid: docRef.id });
  } catch (e: any) {
    console.error("Error creating user: ", e);
    throw new Error(`Failed to create user: ${e.message}`);
  }
};

export const createUsersBatch = async (data: CreateUserInput[]) => {
  const batch = writeBatch(db);
  const existingUsers: CreateUserInput[] = [];

  try {
    for (const userData of data) {
      const existingUser = await getUserByEmail({ email: userData.email });
      if (existingUser) {
        existingUsers.push(userData);
        continue; // Skip to the next room
      }

      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, {
        ...filterData(userData),
        id: docRef.id,
        uid: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      });
    }

    await batch.commit();
    console.log("Batch user creation successful");

    // Optionally, return the created users
    const createdUsers = await Promise.all(
      data
        .filter(
          (userData) =>
            !existingUsers.some((existing) => existing.email === userData.email)
        )
        .map(async (userData) => {
          const user = await getUserByEmail({ email: userData.email });
          return user;
        })
    );

    return { createdUsers, existingUsers };
  } catch (e: any) {
    console.error("Error creating user batch: ", e);
    throw new Error(`Failed to create user batch: ${e.message}`);
  }
};

export const updateUser = async (data: UpdateUserInput) => {
  try {
    const docRef = doc(db, collectionName, data.uid);
    await updateDoc(docRef, {
      ...filterData(data),
      uid: docRef.id,
      updatedAt: serverTimestamp(),
      isActive: true,
    });
    const updatedDocSnap = await getDoc(docRef);

    if (!updatedDocSnap.exists()) {
      throw new Error("User doesn't exist or did not update");
    }

    return getUser({ uid: updatedDocSnap.id });
  } catch (e) {
    console.error("Error updating user: ", e);
  }
};

export const deleteUser = async (uid: string) => {
  try {
    const docRef = doc(db, collectionName, uid);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      isActive: false,
    });
    // await deleteDoc(docRef);
    console.log("User deleted: ", docRef.id);

    return docRef.id;
  } catch (e: any) {
    console.error("Error deleting user: ", e);
    throw new Error(`Failed to delete user: ${e.message}`);
  }
};
