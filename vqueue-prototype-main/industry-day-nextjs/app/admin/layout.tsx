import MessageDropdown from "@/components/vq/message-drop-down";
import Navbar from "@/components/vq/navbar";
import UserAvatar from "@/components/vq/user-avatar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <main className="w-full py-4 grid grid-cols-1 sm:grid-cols-5 items-center bg-vq-white sm:px-16">
        <div className="max-sm:hidden col-span-1">
          <h3 className="sm:text-xl font-bold text-vq-secondary">ID24</h3>
        </div>

        <div className="col-span-3">
          <Navbar />
        </div>

        <div className="w-full flex justify-end items-center gap-5 max-sm:hidden col-span-1">
          <MessageDropdown />
          <UserAvatar />
        </div>
      </main>
      {children}
    </section>
  );
}
