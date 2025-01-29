export default function Indicator({
  type,
  label,
}: {
  type: "success" | "peach" | "failure";
  label: string;
}) {
  return (
    <div className="flex gap-2 text-xs">
      {type === "success" && <SuccessIndicator />}
      {type === "peach" && <PendingIndicator />}
      {type === "failure" && <FailureIndicator />}
      <div>{label}</div>
    </div>
  );
}

export function SuccessIndicator() {
  return <div className="w-4 rounded-sm aspect-square bg-vq-success"></div>;
}

export function PendingIndicator() {
  return <div className="w-4 rounded-sm aspect-square bg-vq-peach"></div>;
}

export function FailureIndicator() {
  return <div className="w-4 rounded-sm aspect-square bg-vq-failure"></div>;
}
