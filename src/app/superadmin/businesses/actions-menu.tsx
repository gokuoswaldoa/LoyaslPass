"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, PlayCircle, StopCircle, Clock } from "lucide-react";
import { extendTrial, activateSubscription, suspendAccount } from "@/app/actions/superadmin";
import { motion, AnimatePresence } from "framer-motion";

export function ActionsMenu({ businessId, currentStatus }: { businessId: string; currentStatus: string | null }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    
    function updatePosition() {
      if (open && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // Position menu to the left of the button and below it slightly
        setCoords({
          top: rect.bottom + window.scrollY + 8,
          left: rect.right + window.scrollX - 224 // 224 is w-56
        });
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updatePosition, true); // true to catch all scroll events
      window.addEventListener("resize", updatePosition);
      updatePosition();
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const handleAction = async (action: () => Promise<unknown>) => {
    if (loading) return;
    setOpen(false);
    setLoading(true);
    await action();
    setLoading(false);
  };

  const menuContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ 
            position: "absolute",
            top: coords.top,
            left: coords.left,
            zIndex: 9999
          }}
          className="w-56 overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 border border-slate-200/50 dark:border-white/10"
        >
          <div className="py-2">
            <div className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-100/50 dark:border-slate-800/50">
              Acciones
            </div>
            
            {currentStatus !== "suspended" && (
              <button
                onClick={() => handleAction(() => activateSubscription(businessId))}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-white/50 dark:hover:bg-slate-800/50 flex items-center transition-colors group"
              >
                <div className="mr-3 p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-4 w-4" /> 
                </div>
                Activar Mensualidad
              </button>
            )}

            {currentStatus !== "suspended" && (
              <button
                onClick={() => handleAction(() => extendTrial(businessId, 15))}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50 flex items-center transition-colors group"
              >
                <div className="mr-3 p-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 group-hover:scale-110 transition-transform">
                  <Clock className="h-4 w-4" /> 
                </div>
                Extender Prueba
              </button>
            )}

            {currentStatus !== "suspended" && (
              <button
                onClick={() => handleAction(() => suspendAccount(businessId))}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-white/50 dark:hover:bg-slate-800/50 flex items-center transition-colors group"
              >
                <div className="mr-3 p-1.5 rounded-full bg-rose-100 dark:bg-rose-500/20 group-hover:scale-110 transition-transform">
                  <StopCircle className="h-4 w-4" /> 
                </div>
                Suspender Cuenta
              </button>
            )}

            {currentStatus === "suspended" && (
              <button
                onClick={() => handleAction(() => extendTrial(businessId, 15))}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-white/50 dark:hover:bg-slate-800/50 flex items-center transition-colors group"
              >
                <div className="mr-3 p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-4 w-4" /> 
                </div>
                Reactivar (15d)
              </button>
            )}
            
            {currentStatus === "suspended" && (
              <button
                onClick={() => handleAction(() => activateSubscription(businessId))}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-white/50 dark:hover:bg-slate-800/50 flex items-center transition-colors group"
              >
                <div className="mr-3 p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-4 w-4" /> 
                </div>
                Activar Mensualidad
              </button>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="h-10 w-10 p-0 inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
      >
        <span className="sr-only">Abrir menú</span>
        <MoreHorizontal className="h-5 w-5 text-slate-500" />
      </button>

      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </>
  );
}
