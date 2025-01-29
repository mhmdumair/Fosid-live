export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Company Layout</h1>
      {children}
    </div>
  );
}
