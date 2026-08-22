import type { Metadata, Viewport } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "./Providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "LoyalPass - Digital Loyalty",
  description: "Premium Digital Loyalty Cards for Apple and Google Wallet",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LoyalPass",
  },
  icons: {
    apple: "/logo/icono.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning className={`${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased relative overflow-x-hidden selection:bg-emerald-500/30`}>
        
        {/* ENHANCED DYNAMIC BACKGROUND */}
        {/* Base Gradient */}
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-white via-gray-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 pointer-events-none" />
        
        {/* Grid Pattern */}
        <div className="fixed inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" />
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        
        {/* Glowing Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-300/10 dark:bg-emerald-300/10 blur-[100px] pointer-events-none" />
        
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalHeader />
            <main className="pt-20 min-h-screen">
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
