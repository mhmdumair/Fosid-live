import { PaginatedParams } from "./params";


export type CreateMessageInput = {
    email: string;
    message: string;
};


export type UpdateMessageInput = {
    id: string;
    email?: string;
    message?: string;
};


export interface GetMessagesParams extends PaginatedParams {
    email?: string;
    createdAt?: Date;
}


export interface GetMessageParams {
    id: string;
}


export interface GetMessageByEmailParams {
    email: string;
}
