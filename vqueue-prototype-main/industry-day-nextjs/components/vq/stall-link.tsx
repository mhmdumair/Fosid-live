import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StallLinkFooter from "./stall-link-footer";
import { UserUnion } from "@/lib/models/unions/user.union";
import { IStall } from "@/lib/models/interfaces/IStall";

interface StallLinkProps {
  stall: IStall;
  user?: UserUnion;
  name: string;
  roomName?: string;
  companyName?: string;
}

export default function StallLink({
  stall,
  user,
  name,
  roomName,
  companyName,
}: StallLinkProps) {
  return (
    <Card
      key={name}
      className="group hover:border-stone-300  bg-white  flex flex-col justify-between"
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-gray-700 text-lg">{roomName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2"></CardContent>
      <CardFooter className="p-0 bg-vq-pearl rounded-b-md">
        <StallLinkFooter
          stall={stall}
          user={user}
          name={name}
          roomName={roomName}
          companyName={companyName}
        />
      </CardFooter>
    </Card>
  );
}
