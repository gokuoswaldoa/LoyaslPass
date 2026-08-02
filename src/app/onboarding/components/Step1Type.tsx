"use client";

import { OnboardingData } from "../page";
import { Coffee, Utensils, Cake, Wine, Scissors, Flower2, ShoppingBag, Dumbbell, PawPrint, Sparkles } from "lucide-react";

type Props = {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
};

const options = [
  { id: "cafeteria", label: "Cafetería", icon: Coffee },
  { id: "restaurante", label: "Restaurante", icon: Utensils },
  { id: "panaderia", label: "Panadería y postres", icon: Cake },
  { id: "bar", label: "Bar y bebidas", icon: Wine },
  { id: "salon", label: "Salón y barbería", icon: Scissors },
  { id: "belleza", label: "Belleza y spa", icon: Flower2 },
  { id: "tienda", label: "Tienda y boutique", icon: ShoppingBag },
  { id: "fitness", label: "Fitness y bienestar", icon: Dumbbell },
  { id: "mascotas", label: "Mascotas", icon: PawPrint },
];

export function Step1Type({ data, updateData, onNext }: Props) {
  const handleSelect = (id: string) => {
    updateData({ businessType: id });
    setTimeout(() => onNext(), 300); // Pequeño retraso para que se vea la selección
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-wide uppercase mb-4 shadow-sm border border-emerald-200 dark:border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" /> ¡Comencemos!
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          ¿A qué se dedica tu negocio?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
          Dinos tu giro y prepararemos un pase de lealtad diseñado específicamente para multiplicar tus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              data.businessType === opt.id
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/20"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-800"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${
              data.businessType === opt.id ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}>
              <opt.icon className="w-5 h-5" />
            </div>
            <span className={`flex-grow font-semibold ${data.businessType === opt.id ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
              {opt.label}
            </span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              data.businessType === opt.id ? "border-emerald-500" : "border-slate-300 dark:border-slate-700"
            }`}>
              {data.businessType === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
            </div>
          </button>
        ))}

        {/* Opción Otro que ocupa toda la fila */}
        <button
          onClick={() => handleSelect("otro")}
          className={`col-span-1 md:col-span-2 flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
            data.businessType === "otro"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/20"
              : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-800"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${
            data.businessType === "otro" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <span className={`block font-bold ${data.businessType === "otro" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
              Otro giro distinto
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Todo negocio merece clientes leales</span>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            data.businessType === "otro" ? "border-emerald-500" : "border-slate-300 dark:border-slate-700"
          }`}>
            {data.businessType === "otro" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
          </div>
        </button>
      </div>
      
      <p className="text-center text-sm font-medium text-slate-400 mt-8">
        Selecciona una opción para continuar
      </p>
    </div>
  );
}
