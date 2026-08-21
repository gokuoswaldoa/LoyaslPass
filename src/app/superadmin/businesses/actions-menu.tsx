"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, PlayCircle, StopCircle, Clock } from "lucide-react";
import { extendTrial, activateSubscription, suspendAccount } from "@/app/actions/superadmin";

export function ActionsMenu({ businessId, currentStatus }: { businessId: string; currentStatus: string | null }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (action: () => Promise<unknown>) => {
    if (loading) return;
    setOpen(false);
    setLoading(true);
    await action();
    setLoading(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="h-8 w-8 p-0 inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
      >
        <span className="sr-only">Abrir menú</span>
        <MoreHorizontal className="h-4 w-4 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-200 dark:border-slate-800">
          <div className="py-1">
            <div className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
              Acciones
            </div>
            
            {currentStatus !== "suspended" && (
              <button
                onClick={() => handleAction(() => activateSubscription(businessId))}
                className="w-full text-left px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
              >
                <PlayCircle className="mr-2 h-4 w-4" /> Activar Mensualidad
              </button>
            )}

            {currentStatus !== "suspended" && (
              <button
                onClick={() => handleAction(() => extendTrial(businessId, 15))}
                className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
              >
                <Clock className="mr-2 h-4 w-4" /> Extender Prueba (15d)
              </button>
            )}

            {currentStatus !== "suspended" && (
              <button
                onClick={() => handleAction(() => suspendAccount(businessId))}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
              >
                <StopCircle className="mr-2 h-4 w-4" /> Suspender Cuenta
              </button>
            )}

            {currentStatus === "suspended" && (
              <button
                onClick={() => handleAction(() => extendTrial(businessId, 15))}
                className="w-full text-left px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
              >
                <PlayCircle className="mr-2 h-4 w-4" /> Reactivar (15d)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
