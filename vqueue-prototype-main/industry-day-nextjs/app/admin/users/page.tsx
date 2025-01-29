
import UsersList from "@/components/vq/usersList";

export default async function Page() {
  return (
    <div className="w-full">
      {/* add a suspense and fallback call */}
      <UsersList />
    </div>
  );
}
