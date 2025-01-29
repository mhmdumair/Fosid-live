export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>AdminDashboard Layout</h1>
      {children}
    </div>
  );
}
