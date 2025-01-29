import Spinner from "@/components/vq/spinner";

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Spinner />
        <div>
          You are been redirected to the requested page. Please wait patiently.
        </div>
      </div>
    </div>
  );
}
