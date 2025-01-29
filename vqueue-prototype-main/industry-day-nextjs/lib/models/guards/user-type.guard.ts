import { CreateUserInput } from "../params/user.params";

const isCreateUserInput = (data: any): data is CreateUserInput => {
  return (
    (typeof data.name === "undefined" || typeof data.name === "string") &&
    typeof data.email === "string" &&
    typeof data.role === "string" &&
    (typeof data.phone1 === "undefined" || typeof data.phone1 === "string") &&
    (typeof data.phone2 === "undefined" || typeof data.phone2 === "string") &&
    (typeof data.regNo === "undefined" || typeof data.regNo === "string") &&
    (typeof data.group === "undefined" || typeof data.group === "string") &&
    (typeof data.level === "undefined" || typeof data.level === "string") &&
    (typeof data.companyName === "undefined" ||
      typeof data.companyName === "string") &&
    (typeof data.roomName === "undefined" || typeof data.roomName === "string")
  );
};
