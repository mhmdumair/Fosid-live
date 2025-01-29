import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { IMessage } from "../interfaces/IMessage";


export function genericMessageMapper<T>(doc: DocumentData): T {
    return {
        ...doc.data(),
        id: doc.id,
        email: doc.data().email,
        message: doc.data().message,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        deletedAt: doc.data().deletedAt?.toDate(),
    } as T;
}


export function genericMessagesMapper<T>(
    querySnapshot: QuerySnapshot<DocumentData>
): T[] {
    return querySnapshot.docs.map((doc) => genericMessageMapper<T>(doc)) as T[];
}


export function messageMapper(doc: DocumentData): IMessage {
    return genericMessageMapper<IMessage>(doc);
}


export function messagesMapper(
    querySnapshot: QuerySnapshot<DocumentData>
): IMessage[] {
    return genericMessagesMapper<IMessage>(querySnapshot);
}


export function messageEmailMapper(
    querySnapshot: QuerySnapshot<DocumentData>
): { id: string; email: string }[] {
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
    }));
}
