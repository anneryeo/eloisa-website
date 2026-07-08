import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Eloisa — Art Portfolio",
  description: "A minimalist gallery of works.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
