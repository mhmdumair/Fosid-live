import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { IRoom } from "../interfaces/IRoom";

// unit

export function genericRoomMapper<T>(doc: DocumentData): T {
  return {
    ...doc.data(),
    id: doc.id,
    roomId: doc.data().roomId,
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    deletedAt: doc.data().deletedAt?.toDate(),
    name: doc.data().name,
    stallIds: doc.data()?.stallIds,
    roomAdminId: doc.data().roomAdminId,
    departmentName: doc.data().departmentName,
    location: doc.data()?.location,
    blockNumber: doc.data()?.blockNumber,
  } as T;
}

export function genericRoomsMapper<T>(
  querySnapshot: QuerySnapshot<DocumentData>
): T[] {
  return querySnapshot.docs.map((doc) => genericRoomMapper<T>(doc)) as T[];
}

export function roomMapper(doc: DocumentData): IRoom {
  return genericRoomMapper<IRoom>(doc);
}

export function roomsMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): IRoom[] {
  return genericRoomsMapper<IRoom>(querySnapshot);
}
