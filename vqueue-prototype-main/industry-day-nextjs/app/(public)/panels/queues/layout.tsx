export default function PublicQueuesLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
