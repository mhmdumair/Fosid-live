import Link from "next/link";

export default function RedirectFromHome() {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <Link
        href="/panels"
        className="w-full text-center bg-stone-800 hover:bg-blue-300 font-medium py-2 px-4 rounded-md text-white"
      >
        View Schedule as a Guest
      </Link>
      <Link
        href="/login"
        className="w-full text-center bg-blue-500 hover:bg-blue-300 font-medium py-2 px-4 rounded-md text-white"
      >
        Login
      </Link>
    </div>
  );
}
