import Navbar from "@/components/vq/navbar";
import MessageDropdown from "@/components/vq/message-drop-down";
import UserAvatar from "@/components/vq/user-avatar";
import { appConfig } from "@/lib/config/app.config";
import Footer from "@/components/vq/footer";
import Image from "next/image";

export default function PublicLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col min-h-screen">
      <main className="w-full py-4 grid grid-cols-1 sm:grid-cols-5 items-center bg-white sm:px-16">
        <div className="max-sm:hidden col-span-1 flex gap-2">
          <div className="flex items-center">
            <Image
              src="/images/uop.png"
              alt="uop-logo"
              width={40}
              height={40}
            />
          </div>
          <div className="hidden lg:flex items-center sm:text-xl font-bold text-vq-secondary">
            <p>{appConfig.name}</p>
            <p className="text-sm">{appConfig.owner}</p>
          </div>
          <div className="flex items-center lg:hidden sm:text-xl font-bold text-vq-secondary">
            {appConfig.shortName}
          </div>
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
