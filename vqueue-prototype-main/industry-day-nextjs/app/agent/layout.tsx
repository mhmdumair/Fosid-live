import Footer from "@/components/vq/footer";
import MessageDropdown from "@/components/vq/message-drop-down";
import Navbar from "@/components/vq/navbar";
import UserAvatar from "@/components/vq/user-avatar";
import { appConfig } from "@/lib/config/app.config";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col min-h-screen">
      <main className="w-full py-4 grid grid-cols-1 sm:grid-cols-5 items-center bg-white sm:px-16">
        <div className="max-sm:hidden col-span-1">
          <h3 className="hidden lg:block sm:text-xl font-bold text-vq-secondary">
            {appConfig.name}
          </h3>
          <h3 className="block lg:hidden sm:text-xl font-bold text-vq-secondary">
            {appConfig.shortName}
          </h3>
        </div>

        <div className="col-span-3">
          <Navbar />
        </div>

        <div className="w-full flex justify-end items-center gap-5 max-sm:hidden col-span-1">
          <MessageDropdown />
          <UserAvatar />
        </div>
      </main>
      <div className="flex-grow">{children}</div>
      <Footer />
    </section>
  );
}
