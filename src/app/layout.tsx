import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

/* ── Display / Title font — geometric, angular, race-ready */
const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

/* ── HUD / Monospace — hacker terminal feel */
const shareTechMono = Share_Tech_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

/* ── Body / Stats — clean military-grade sans */
const rajdhani = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mercedes-AMG W14 | Engineering Unleashed",
  description: "Interactive 3D experience of the Mercedes-AMG Petronas F1 W14 E Performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${shareTechMono.variable} ${rajdhani.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
