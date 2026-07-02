import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AppShell from "@/components/AppShell";
import TopNav from "@/components/TopNav";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Tavolara Calcio", template: "%s · Tavolara" },
  description: "App ufficiale del Tavolara Calcio — Prima Categoria Sardegna",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Tavolara" },
};

export const viewport = { themeColor: "#14110c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${manrope.variable} ${spaceMono.variable} h-full`}>
      <body className="min-h-full bg-nero text-avorio">
        <AppShell>
          <TopNav />
          <main style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
            {children}
          </main>
          <BottomNav />
        </AppShell>
      </body>
    </html>
  );
}
