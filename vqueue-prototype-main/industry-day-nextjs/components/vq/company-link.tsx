import { IStall } from "@/lib/models/interfaces/IStall";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StallLink from "./stall-link";
import { UserUnion } from "@/lib/models/unions/user.union";

interface CompanyLinkProps {
  user?: UserUnion;
  id: string;
  name: string;
  email?: string;
  stalls?: IStall[];
}

export default function CompanyLink({
  user,
  id,
  name,
  email,
  stalls,
}: CompanyLinkProps) {
  return (
    <Card key={id} className="bg-white border-0 drop-shadow-sm flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-stone-800 text-lg lg:text-2xl line-clamp-1">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="w-full flex flex-col gap-2">
          {stalls?.map((stall) => (
            <StallLink
              key={stall.stallId}
              user={user}
              stall={stall}
              name={stall.name}
              roomName={stall.roomName}
              companyName={stall.companyName}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
