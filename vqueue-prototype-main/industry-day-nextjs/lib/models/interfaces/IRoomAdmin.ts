import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export interface IRoomAdmin extends IUser {
  roomName: string;
  room?: IRoom;
}
