"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

export function GlobalHeader() {
  const pathname = usePathname();

  // Ocultar el GlobalHeader si estamos dentro del dashboard o superadmin
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/superadmin")) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
            <div className="relative h-12 md:h-14 w-56 md:w-64 flex-shrink-0">
              <Image 
                src="/logo/color%20definitivo%20con%20titutlo.svg" 
                alt="LoyalPass" 
                fill 
                className="object-contain object-left dark:invert" 
                priority
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/onboarding" className="hidden md:inline-flex text-sm font-semibold hover:text-emerald-500 transition-colors">
              Constructor Visual
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="h-20 w-full" aria-hidden="true" />
    </>
  );
}
