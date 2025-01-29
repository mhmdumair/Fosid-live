import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { IUser } from "../interfaces/IUser";
import { IStudent } from "../interfaces/IStudent";
import { ICompanyAdmin } from "../interfaces/ICompanyAdmin";
import { IRoomAdmin } from "../interfaces/IRoomAdmin";

// unit

export function genericUserMapper<T>(doc: DocumentData): T {
  return {
    ...doc.data(),
    id: doc.id,
    uid: doc.data().uid,
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    deletedAt: doc.data().deletedAt?.toDate(),
    role: doc.data().role,
    name: doc.data().name,
    email: doc.data().email,
    phone1: doc.data().phone1,
    phone2: doc.data().phone2,
    linkedAuthId: doc.data().linkedAuthId,
  } as T;
}

export function userMapper(doc: DocumentData): IUser {
  return genericUserMapper<IUser>(doc);
}

export function studentMapper(doc: DocumentData): IStudent {
  return {
    ...genericUserMapper<IStudent>(doc),
    regNo: doc.data().regNo,
    group: doc.data().group,
    level: doc.data().level,
    interviewIds: doc.data().interviewIds,
  };
}

export function companyAdminMapper(doc: DocumentData): ICompanyAdmin {
  return {
    ...genericUserMapper<ICompanyAdmin>(doc),
    companyName: doc.data().companyName,
  };
}

export function roomAdminMapper(doc: DocumentData): IRoomAdmin {
  return {
    ...genericUserMapper<IRoomAdmin>(doc),
    roomName: doc.data().roomName,
  };
}

// bulk

export function genericUsersMapper<T>(
  querySnapshot: QuerySnapshot<DocumentData>
): T[] {
  return querySnapshot.docs.map((doc) => genericUserMapper<T>(doc)) as T[];
}

export function usersMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): IUser[] {
  return genericUsersMapper<IUser>(querySnapshot);
}

export function studentsMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): IStudent[] {
  return querySnapshot.docs.map((doc) => studentMapper(doc)) as IStudent[];
}

export function companyAdminsMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): ICompanyAdmin[] {
  return querySnapshot.docs.map((doc) =>
    companyAdminMapper(doc)
  ) as ICompanyAdmin[];
}

export function roomAdminsMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): IRoomAdmin[] {
  return querySnapshot.docs.map((doc) => roomAdminMapper(doc)) as IRoomAdmin[];
}
