import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { IStall } from "../interfaces/IStall";
// unit

export function genericStallMapper<T>(doc: DocumentData): T {
  return {
    ...doc.data(),
    id: doc.data().id,
    stallId: doc.data().stallId,
    name: doc.data().name,
    stallStatus: doc.data().stallStatus,
    roomName: doc.data().roomName,
    queueNames: doc.data()?.queueNames,
    companyName: doc.data().companyName,
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    deletedAt: doc.data().deletedAt?.toDate(),
  } as T;
}

export function genericStallsMapper<T>(
  querySnapshot: QuerySnapshot<DocumentData>
): T[] {
  return querySnapshot.docs.map((doc) => genericStallMapper<T>(doc)) as T[];
}

export function stallMapper(doc: DocumentData): IStall {
  return genericStallMapper<IStall>(doc);
}

export function stallsMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): IStall[] {
  return genericStallsMapper<IStall>(querySnapshot);
}

export function stallNamesMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): { roomName: string; name: string }[] {
  return querySnapshot.docs.map((doc) => ({
    roomName: doc.data().roomName,
    name: doc.data().name,
  }));
}
