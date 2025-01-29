export default function RoomMapLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-screen pb-4">
      {/* Include shared UI here e.g. a header or sidebar */}
      {children}
    </section>
  );
}
