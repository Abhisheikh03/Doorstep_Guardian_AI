import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doorstep Guardian AI | Amazon Ring Security Intelligence",
  description:
    "An AI-powered home-safety system transforming Ring doorstep events into contextual, trackable outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full w-full">
      <body className="bg-ring-dark text-ring-text h-full w-full antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
