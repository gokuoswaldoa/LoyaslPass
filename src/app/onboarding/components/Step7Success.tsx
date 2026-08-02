"use client";

import { OnboardingData } from "../page";
import { Rocket, Store, Stamp, Star, Gift } from "lucide-react";
import Image from "next/image";
import PlugConnectedIcon from "@/components/ui/plug-connected-icon";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";

type Props = {
  data: OnboardingData;
};

export function Step7Success({ data }: Props) {
  const handleLogin = () => {
    // Save onboarding data to cookie so we don't lose it during OAuth redirect
    Cookies.set("loyalpass_onboarding", JSON.stringify(data), { expires: 1 }); // 1 day
    // Redirect to login
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col h-full">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-wide uppercase mb-4 shadow-sm border border-emerald-200 dark:border-emerald-500/20">
          <Rocket className="w-3.5 h-3.5" /> ¡Todo Listo!
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          <span className="text-emerald-500">{data.businessName || "Tu negocio"}</span> está a punto de despegar.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
          Inicia sesión para guardar tu programa de lealtad. <strong className="font-bold text-slate-800 dark:text-slate-200">Un solo toque</strong> y estarás en tu nuevo centro de control.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border-2 border-slate-100 dark:border-slate-800 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Tu Configuración</span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-500 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
            <PlugConnectedIcon size={18} className="text-emerald-500" /> Listo
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Negocio</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{data.businessName || "No definido"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo de Programa</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white capitalize">Tarjetas de Sellos</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Se llena a los</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{data.stampsCount} sellos</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Qué reciben</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{data.reward || "Por definir"}</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogin}
        className="w-full py-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-center items-center gap-3 font-semibold text-slate-700 dark:text-slate-200 shadow-sm mb-4"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar con Google
      </button>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
        ¿Ya tienes una cuenta? <a href="#" className="text-emerald-500 font-semibold hover:underline">Inicia sesión</a>
      </div>
    </div>
  );
}
