import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { IQueue } from "../interfaces/IQueue";

// unit

export function genericQueueMapper<T>(doc: DocumentData): T {
  return {
    ...doc.data(),
    id: doc.data().id,
    queueId: doc.data().queueId,
    name: doc.data().name,
    stallName: doc.data().stallName,
    queueStatus: doc.data().queueStatus,
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    deletedAt: doc.data().deletedAt?.toDate(),
    interviewIds: doc.data()?.interviewIds,
    baseTime: doc.data()?.baseTime,
  } as T;
}

export function genericQueuesMapper<T>(
  querySnapshot: QuerySnapshot<DocumentData>
): T[] {
  return querySnapshot.docs.map((doc) => genericQueueMapper<T>(doc)) as T[];
}

export function queueMapper(doc: DocumentData): IQueue {
  return genericQueueMapper<IQueue>(doc);
}

export function queuesMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): IQueue[] {
  return genericQueuesMapper<IQueue>(querySnapshot);
}
