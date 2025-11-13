import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhatsApp Messaging Agent",
  description: "Send WhatsApp messages to registered users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
