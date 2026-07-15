import type { Metadata } from "next";
import { Architects_Daughter, Poppins } from "next/font/google";

import "./globals.css";

// The comps set the wordmark in "Scribbled", which isn't licensed for web
// embedding. Architects Daughter is the closest free stand-in: upright,
// monoline, handwritten caps. Swap this import if the real face is licensed.
const display = Architects_Daughter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const sans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eloisa Claire Design",
  description:
    "Eloisa Claire is a marketing-led graphic designer and creative storyteller focused on colorful visual direction and campaign-driven design based in Manila, Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
