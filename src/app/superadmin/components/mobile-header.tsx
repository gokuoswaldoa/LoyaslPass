"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LayoutDashboard, Users, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
        <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
        
        <div className="flex-1 flex justify-center">
          <div className="relative w-32 h-8">
            <Image 
              src="/logo/color%20definitivo%20con%20titutlo.svg" 
              alt="LoyalPass" 
              fill 
              className="object-contain dark:invert" 
              priority
            />
          </div>
        </div>

        <Link href="/dashboard" className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-purple-600">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col md:hidden border-r border-slate-200 dark:border-slate-800"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="relative w-32 h-8">
                  <Image 
                    src="/logo/color%20definitivo%20con%20titutlo.svg" 
                    alt="LoyalPass" 
                    fill 
                    className="object-contain dark:invert" 
                  />
                </div>
                <button onClick={() => setOpen(false)} className="p-2 text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-black uppercase tracking-wider text-purple-600 mb-4 px-4">Super Admin</div>
                <Link onClick={() => setOpen(false)} href="/superadmin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 font-medium">
                  <LayoutDashboard size={20} /> Vista General
                </Link>
                <Link onClick={() => setOpen(false)} href="/superadmin/businesses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 font-medium">
                  <Users size={20} /> Negocios
                </Link>
              </nav>
              
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <Link onClick={() => setOpen(false)} href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 font-medium">
                  <ArrowLeft size={20} /> Volver a Dashboard
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
