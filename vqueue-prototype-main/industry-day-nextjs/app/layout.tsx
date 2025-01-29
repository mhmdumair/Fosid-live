import type { Metadata } from "next";

// These styles apply to every route in the application
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "./store-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Industry Day 2024",
  description: "Queue Managemenet Portal for Industry Day 2024",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <StoreProvider>
    <TooltipProvider>
      <html lang="en">
        <body className="bg-slate-100 text-vq-secondary">
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </TooltipProvider>
    // </StoreProvider>
  );
}
