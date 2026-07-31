import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

// The comps set the wordmark in "Scribbled", which isn't licensed for web
// embedding. Architects Daughter is the closest free stand-in: upright,
// monoline, handwritten caps. Swap this import if the real face is licensed.
const display = localFont({
  src: "./fonts/architects-daughter-400.ttf",
  variable: "--font-display",
  display: "swap",
});

// Journal captions and the About greeting are set in a typewriter mono in the
// comps; Space Mono is the closest free face.
const mono = localFont({
  src: [
    { path: "./fonts/space-mono-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/space-mono-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "./fonts/poppins-300.ttf", weight: "300", style: "normal" },
    { path: "./fonts/poppins-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/poppins-500.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eloisa Claire Design",
    template: "%s — Eloisa Claire Design",
  },
  description:
    "Eloisa Claire is a marketing-led graphic designer and creative storyteller focused on colorful visual direction and campaign-driven design based in Manila, Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
