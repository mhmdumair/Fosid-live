export default function AuthLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="w-full h-screen">
        {/* Include shared UI here e.g. a header or sidebar */}
        <nav></nav>
        {children}
      </section>
    )
  }