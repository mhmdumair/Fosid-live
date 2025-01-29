import Queue from "@/components/vq/queue";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
        <p>{params.id}</p>
      {/* <Queue id={params.id} /> */}
      {/* Create <Stall id={params.id} /> */}
    </div>
  );
}
