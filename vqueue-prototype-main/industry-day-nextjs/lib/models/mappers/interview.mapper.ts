import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { IInterview } from "../interfaces/IInterview";

// unit

export function genericInterviewMapper<T>(doc: DocumentData): T {
  return {
    ...doc.data(),
    id: doc.data().id,
    interviewId: doc.data().interviewId,
    studentRegNo: doc.data().studentRegNo,
    stallName: doc.data().stallName,
    companyName: doc.data().companyName,
    isAssignedToQueue: doc.data().isAssignedToQueue,
    queueName: doc.data()?.queueName,
    status: doc.data()?.status,
    type: doc.data().type,
    remark: doc.data()?.remark,
    startTime: doc.data().startTime?.toDate(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    deletedAt: doc.data().deletedAt?.toDate(),
    preference: doc.data()?.preference,
    session: doc.data()?.session,
    position: doc.data()?.position,
  } as T;
}

export function genericInterviewsMapper<T>(
  querySnapshot: QuerySnapshot<DocumentData>
): T[] {
  return querySnapshot.docs.map((doc) => genericInterviewMapper<T>(doc)) as T[];
}

export function interviewMapper(doc: DocumentData): IInterview {
  return genericInterviewMapper<IInterview>(doc);
}

export function interviewMappers(
  querySnapshot: QuerySnapshot<DocumentData>
): IInterview[] {
  return genericInterviewsMapper<IInterview>(querySnapshot);
}
