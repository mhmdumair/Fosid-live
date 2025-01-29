import { firebaseDb as db } from "@/lib/services/firebase";
import {
  collection,
  doc,
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
  CreateMessageInput,
  UpdateMessageInput,
  GetMessagesParams,
  GetMessageParams,
  GetMessageByEmailParams,
} from "@/lib/models/params/imessage.params";
import {
  messageMapper,
  messagesMapper,
} from "@/lib/models/mappers/imessage.mapper";

const collectionName = "messages";

export const getMessagesCount = async () => {
  try {
    const coll = collection(db, collectionName);
    const q = query(coll, where("deletedAt", "==", null));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log("count: ", count);

    return count;
  } catch (error) {
    console.error("Error fetching messages count:", error);
    throw new Error("Failed to fetch messages count");
  }
};

export const getMessages = async ({
  pageSize = 10,
  last,
  first,
  direction,
  email,
  createdAt,
}: GetMessagesParams) => {
  try {
    const filters: any[] = [];

    if (email) {
      filters.push(where("email", "==", email));
    }
    if (createdAt) {
      filters.push(where("createdAt", "==", createdAt));
    }

    const collectionRef = collection(db, collectionName);
    let q;

    if (direction === "next" && last) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("createdAt", "desc"),
        startAfter(last),
        limit(pageSize)
      );
    } else if (direction === "prev" && first) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("createdAt", "desc"),
        endBefore(first),
        limitToLast(pageSize)
      );
    } else {
      q = query(
        collectionRef,
        ...filters,
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
    }

    const querySnap = await getDocs(q);

    return messagesMapper(querySnap);
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
};

export const getMessage = async ({ id }: GetMessageParams) => {
  try {
    if (!id) {
      throw new Error("id is required");
    }

    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().deletedAt) {
      return null;
    }

    console.log("Document data:", docSnap.data());
    return messageMapper(docSnap);
  } catch (error) {
    console.error("Error fetching message:", error);
    throw new Error("Failed to fetch message");
  }
};

export const getMessageByEmail = async ({ email }: GetMessageByEmailParams) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("email", "==", email));
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return messageMapper(querySnap.docs[0]);
  } catch (error: any) {
    console.error("Error fetching message by email:", error);
    throw new Error(`Failed to fetch message by email: ${error.message}`);
  }
};

export const createMessage = async (data: CreateMessageInput) => {
  try {
    const docRef = doc(collection(db, collectionName));

    await setDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Message created at: ", docRef.id);

    return getMessage({ id: docRef.id });
  } catch (e: any) {
    console.error("Error creating message: ", e);
    throw new Error(`Failed to create message: ${e.message}`);
  }
};

export const createMessagesBatch = async (data: CreateMessageInput[]) => {
  const batch = writeBatch(db);

  try {
    for (const messageData of data) {
      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, {
        ...filterData(messageData),
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    console.log("Batch message creation successful");

    // Optionally, return the created messages
    const createdMessages = await Promise.all(
      data.map(async (messageData) => {
        const message = await getMessageByEmail({ email: messageData.email });
        return message;
      })
    );

    return createdMessages;
  } catch (e: any) {
    console.error("Error creating message batch: ", e);
    throw new Error(`Failed to create message batch: ${e.message}`);
  }
};

export const updateMessage = async (data: UpdateMessageInput) => {
  try {
    const docRef = doc(db, collectionName, data.id);
    await updateDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      updatedAt: serverTimestamp(),
    });
    const updatedDocSnap = await getDoc(docRef);

    if (!updatedDocSnap.exists()) {
      throw new Error("Message doesn't exist or did not update");
    }

    return getMessage({ id: updatedDocSnap.id });
  } catch (e: any) {
    console.error("Error updating message: ", e);
  }
};

export const deleteMessage = async (id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
    });
    console.log("Message deleted: ", docRef.id);

    return docRef.id;
  } catch (e: any) {
    console.error("Error deleting message: ", e);
    throw new Error(`Failed to delete message: ${e.message}`);
  }
};
