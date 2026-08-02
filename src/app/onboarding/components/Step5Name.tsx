"use client";

import { OnboardingData } from "../page";
import { Edit3, CheckCircle2, Gift, ArrowRight } from "lucide-react";
import { getBusinessIcon } from "../utils";

type Props = {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
};

export function Step5Name({ data, updateData, onNext }: Props) {
  const isComplete = data.businessName.trim().length > 0;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 text-xs font-black tracking-wide uppercase mb-4 shadow-sm border border-amber-200 dark:border-amber-500/20">
          <Edit3 className="w-3.5 h-3.5" /> Identidad
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          ¿Cómo se llama tu marca?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
          El nombre oficial que verán tus clientes al abrir su Apple Wallet o Google Wallet.
        </p>
      </div>

      <div className="relative mb-10">
        <label className="absolute -top-3 left-4 px-2 bg-white dark:bg-background text-xs font-bold text-emerald-600 dark:text-emerald-500 tracking-wider uppercase">
          Nombre del negocio
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            placeholder="ej. La Casa del Café"
            className="w-full px-6 py-5 rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 text-xl font-medium text-slate-900 dark:text-white focus:outline-none shadow-sm"
          />
          {isComplete && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="w-full bg-[#1B4332] rounded-3xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
        {/* Card Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center text-white/90 font-bold text-2xl">
            {data.businessName ? data.businessName.charAt(0).toUpperCase() : "T"}
          </div>
          <span className="text-2xl font-bold text-white/90 tracking-tight">
            {data.businessName || "Tu negocio"}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 relative z-10">
          {Array.from({ length: Math.min(data.stampsCount, 5) }).map((_, i) => {
            const isFilled = i < 3;
            const isLast = i === Math.min(data.stampsCount, 5) - 1;
            const StampIcon = getBusinessIcon(data.businessType);

            return (
              <div
                key={i}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isFilled 
                    ? "bg-[#D4A373] text-[#1B4332]" 
                    : isLast && data.stampsCount <= 5
                      ? "bg-[#F3D5C0] text-[#D4A373]" 
                      : "border border-dashed border-white/30 text-white/30"
                }`}
              >
                {isFilled ? (
                  <StampIcon className="w-6 h-6" />
                ) : isLast && data.stampsCount <= 5 ? (
                  <Gift className="w-6 h-6" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isComplete}
        className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-colors flex justify-center items-center gap-2 mt-auto shadow-lg shadow-emerald-600/20"
      >
        Continuar <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
