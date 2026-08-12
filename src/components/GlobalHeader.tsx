"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

export function GlobalHeader() {
  const pathname = usePathname();

  // Ocultar el GlobalHeader si estamos dentro del dashboard
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image 
              src="/logo/nuevoLogo.svg" 
              alt="LoyalPass Icon" 
              fill 
              className="object-contain dark:invert" 
              priority
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            Loyal<span className="text-emerald-500">Pass</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/onboarding" className="hidden md:inline-flex text-sm font-semibold hover:text-emerald-500 transition-colors">
            Constructor Visual
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
