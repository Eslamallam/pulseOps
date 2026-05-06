import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse Ops",
  description: "Real-time system monitoring and incident management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster richColors position="top-right" />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}