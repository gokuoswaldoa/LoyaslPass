"use client";

import { useState, useEffect } from "react";
import { X, Apple, Smartphone } from "lucide-react";
import Image from "next/image";

export default function InstallTutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    // Only show if not in standalone (installed) mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
      // Small delay to not be too aggressive
      const timer = setTimeout(() => setIsOpen(true), 1500);
      
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setOs("ios");
      } else if (/android/.test(userAgent)) {
        setOs("android");
      }
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
          
          <div className="text-center mb-6 mt-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Guarda tu Tarjeta
            </h2>
            <p className="text-slate-500 text-sm">
              Agrega esta tarjeta a la pantalla de inicio de tu celular para no perderla nunca y abrirla rápido.
            </p>
          </div>

          {os === "ios" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">1</div>
                <p>Toca el ícono de <strong>Compartir</strong> en la barra inferior de Safari.</p>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-40 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                {/* PLACEHOLDER CAPTURA IOS 1 */}
                <span className="text-slate-400 text-sm font-bold">Captura iOS 1</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">2</div>
                <p>Desliza hacia abajo y selecciona <strong>Agregar a Inicio</strong>.</p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-40 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                {/* PLACEHOLDER CAPTURA IOS 2 */}
                <span className="text-slate-400 text-sm font-bold">Captura iOS 2</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">1</div>
                <p>Toca el menú de <strong>tres puntos</strong> en la esquina superior derecha.</p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-40 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                {/* PLACEHOLDER CAPTURA ANDROID 1 */}
                <span className="text-slate-400 text-sm font-bold">Captura Android 1</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">2</div>
                <p>Selecciona <strong>Instalar Aplicación</strong> o <strong>Agregar a la pantalla principal</strong>.</p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-40 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                {/* PLACEHOLDER CAPTURA ANDROID 2 */}
                <span className="text-slate-400 text-sm font-bold">Captura Android 2</span>
              </div>
            </div>
          )}

          <button 
            onClick={() => setIsOpen(false)}
            className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-[1.02] transition-transform"
          >
            Entendido, lo haré
          </button>
        </div>
      </div>
    </div>
  );
}
