"use client";

import { OnboardingData } from "../page";
import { Gift, Coffee, Cake, Percent, Tag, CopyPlus, Edit2, ArrowRight } from "lucide-react";
import { useState } from "react";

type Props = {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
};

const quickOptions = [
  { label: "Bebida gratis", icon: Coffee },
  { label: "Pastel gratis", icon: Cake },
  { label: "Regalo gratis", icon: Gift },
  { label: "Descuento", icon: Tag },
  { label: "50% en el segundo", icon: Percent },
  { label: "2x1", icon: CopyPlus },
];

export function Step4Reward({ data, updateData, onNext }: Props) {
  const [inputValue, setInputValue] = useState(data.reward);

  const handleQuickSelect = (label: string) => {
    setInputValue(label);
    updateData({ reward: label });
  };

  const handleContinue = () => {
    updateData({ reward: inputValue || "Cámbiame — decido después" });
    onNext();
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black tracking-wide uppercase mb-4 shadow-sm border border-orange-200 dark:border-orange-500/20">
          <Gift className="w-3.5 h-3.5" /> La Gran Recompensa
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          ¿Qué ganan tus clientes más leales?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
          El premio final al llenar su pase. Cámbialo cuando quieras — o déjalo en blanco y decide después.
        </p>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl p-8 mb-6 border border-emerald-100 dark:border-emerald-500/10 text-center">
        <div className="text-2xl md:text-3xl font-bold text-emerald-800 dark:text-emerald-400 flex items-center justify-center gap-3 flex-wrap">
          <span>{data.stampsCount} sellos</span>
          <span className="text-slate-300 dark:text-slate-600">=</span>
          <span className={`italic border-b-2 border-dashed pb-1 ${inputValue ? "text-slate-900 dark:text-white border-slate-300 dark:border-slate-600" : "text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700"}`}>
            {inputValue || "lo que reciben"}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ej. 50% en el segundo producto"
          className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">O elige uno rápido:</p>
        <div className="flex flex-wrap gap-3">
          {quickOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleQuickSelect(opt.label)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors text-slate-700 dark:text-slate-300 font-medium"
            >
              <opt.icon className="w-4 h-4 text-slate-400" />
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => handleQuickSelect("Cámbiame — decido después")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 transition-colors text-slate-500 dark:text-slate-400 font-medium italic bg-slate-50 dark:bg-slate-800/50"
          >
            <Edit2 className="w-4 h-4" />
            Cámbiame — decido después
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        ¿Aún no lo sabes? Este texto temporal se mostrará en el pase por ahora — cámbialo cuando quieras desde tu programa.
      </p>

      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 mt-auto shadow-lg shadow-emerald-600/20"
      >
        Continuar <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
