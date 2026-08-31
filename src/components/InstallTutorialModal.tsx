"use client";

import { useState, useEffect } from "react";
import { X, Apple, Smartphone } from "lucide-react";
import Image from "next/image";

export default function InstallTutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "other">("ios");
  const [config, setConfig] = useState({
    title: "Guarda tu Tarjeta",
    subtitle: "Agrega esta tarjeta a la pantalla de inicio de tu celular para no perderla nunca y abrirla rpido.",
    blocking: false,
    storageKey: "tutorialSeen"
  });

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail) {
        setConfig(prev => ({ ...prev, ...e.detail }));
      }
      setIsOpen(true);
    };
    window.addEventListener("openTutorial", handleOpen);

    // Only auto-show for customers by default if no params
    // Let's rely on the pages to trigger it, except for the customer pass which we trigger here
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasSeenTutorial = localStorage.getItem("tutorialSeen") === "true";
    
    if (!isStandalone && !hasSeenTutorial && window.location.pathname.includes('/pass/')) {
      // Small delay to not be too aggressive
      const timer = setTimeout(() => setIsOpen(true), 1500);
      
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setOs("ios");
      } else if (/android/.test(userAgent)) {
        setOs("android");
      }
      return () => {
        clearTimeout(timer);
        window.removeEventListener("openTutorial", handleOpen);
      };
    }
    return () => window.removeEventListener("openTutorial", handleOpen);
  }, []);

  const closeTutorial = () => {
    localStorage.setItem(config.storageKey, "true");
    setIsOpen(false);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 relative">
          {!config.blocking && (
            <button 
              onClick={() => closeTutorial()}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          )}
          
          <div className="text-center mb-6 mt-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Guarda tu Tarjeta
            </h2>
            <p className="text-slate-500 text-sm">
              Agrega esta tarjeta a la pantalla de inicio de tu celular para no perderla nunca y abrirla rápido.
            </p>
          </div>

          {os === "ios" ? (
            <div className="space-y-6">
              
              {/* Paso 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">1</div>
                  <p>Presiona los <strong>3 puntos</strong> en tu navegador.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step1.png" alt="Paso 1 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* Paso 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">2</div>
                  <p>Presiona el botón de <strong>Compartir (Share)</strong>.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step2-share.webp" alt="Paso 2 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* Paso 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">3</div>
                  <p>Presiona el botón de <strong>Más opciones (View More)</strong>.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step3-more.webp" alt="Paso 3 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* Paso 4 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">4</div>
                  <p>Selecciona <strong>Agregar a Inicio (Add to Home Screen)</strong>.</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                  <Image src="/tutorial/ios-step4.webp" alt="Paso 4 iOS" width={400} height={300} className="w-full h-auto object-cover" />
                </div>
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
            onClick={() => closeTutorial()}
            className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-[1.02] transition-transform"
          >
            Entendido, lo haré
          </button>
        </div>
      </div>
    </div>
  );
}
