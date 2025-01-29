import Queue from "@/components/vq/queue";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <Queue id={params.id} />
    </div>
  );
}
