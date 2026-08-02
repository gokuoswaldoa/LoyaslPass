"use client";

import { OnboardingData } from "../page";
import { Sparkles, Minus, Plus, Gift, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getBusinessIcon } from "../utils";

type Props = {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
};

export function Step3Stamps({ data, updateData, onNext }: Props) {
  const handleIncrease = () => {
    if (data.stampsCount < 12) updateData({ stampsCount: data.stampsCount + 1 });
  };

  const handleDecrease = () => {
    if (data.stampsCount > 4) updateData({ stampsCount: data.stampsCount - 1 });
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-wide uppercase mb-4 shadow-sm border border-emerald-200 dark:border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Diseño Estratégico
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          ¿Cuántos sellos se necesitan para ganar?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
          La magia ocurre entre 4 y 12. <strong className="font-bold text-slate-800 dark:text-slate-200">El punto dulce son 8</strong>: lo suficientemente rápido para motivar al cliente, lo suficientemente rentable para ti.
        </p>
      </div>

      <div className="flex justify-center items-center gap-6 mb-12 mt-4">
        <button
          onClick={handleDecrease}
          disabled={data.stampsCount <= 4}
          className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          <Minus className="w-6 h-6" />
        </button>

        <motion.div 
          key={data.stampsCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-full bg-emerald-600 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-500/30 relative"
        >
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
          <span className="text-5xl font-bold relative z-10">{data.stampsCount}</span>
          <span className="text-xs font-semibold tracking-widest mt-1 relative z-10 uppercase opacity-90">Sellos</span>
        </motion.div>

        <button
          onClick={handleIncrease}
          disabled={data.stampsCount >= 12}
          className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-800 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Vista Previa</span>
          <span className="text-sm font-semibold text-slate-500">3 / {data.stampsCount}</span>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          {Array.from({ length: data.stampsCount }).map((_, i) => {
            const isFilled = i < 3;
            const isLast = i === data.stampsCount - 1;

            const StampIcon = getBusinessIcon(data.businessType);

            return (
              <motion.div
                key={i}
                layout
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ${
                  isFilled 
                    ? "bg-emerald-600 text-white" 
                    : isLast 
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500 border-2 border-transparent" 
                      : "border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400"
                }`}
              >
                {isFilled ? (
                  <StampIcon className="w-6 h-6" />
                ) : isLast ? (
                  <Gift className="w-6 h-6" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 mt-auto shadow-lg shadow-emerald-600/20"
      >
        Continuar <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
