import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Champions League | Premium Portal",
  description: "The ultimate source for Champions League matches, results, and history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} antialiased stars-bg min-h-screen pt-20`}
      >
        <Navbar />
        <main>{children}</main>
        
        {/* Cinematic Footer Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-gold/10 to-transparent" />
        </div>
      </body>
    </html>
  );
}
