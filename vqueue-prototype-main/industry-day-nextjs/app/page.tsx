
import RedirectFromHome from "@/components/vq/redirect-from-home";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-100 via-white to-slate-100 w-full min-h-screen flex items-center justify-center text-center p-5 sm:p-0">
      <div className="flex flex-col items-center gap-10">
        {/* <Image src="/images/uop.png" alt="uop-logo" width={200} height={200} /> */}
        <div className="flex flex-col items-center">
          <div className="text-4xl sm:text-5xl font-bold">INDUSTRY DAY 2024</div>
          <div className="text-lg sm:text-xl font-medium">
            Faculty of Science, University of Peradeniya
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
            <RedirectFromHome />
        </div>
      </div>
    </div>
  );
}
