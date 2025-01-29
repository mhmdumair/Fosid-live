import RoomForAgent from "@/components/vq/room-for-agent";

export default function AgentRoomPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <RoomForAgent roomId={params.id} />
    </div>
  );
}
