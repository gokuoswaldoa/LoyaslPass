"use client";

import { OnboardingData } from "../page";
import { Palette, Gift, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getBusinessIcon } from "../utils";

type Props = {
  data: OnboardingData;
  updateData: (d: Partial<OnboardingData>) => void;
  onNext: () => void;
};

type StyleOption = {
  id: string;
  category: string;
  cardBg: string; // Tailwind class
  stampBg: string;
  stampIcon: string;
  rewardBg: string;
  rewardIcon: string;
  emptyBorder: string;
  emptyText: string;
  textClass: string;
  swatchPrimary: string;
  swatchSecondary: string;
};

const styles: StyleOption[] = [
  // LUJO
  {
    id: "lujo-mesh",
    category: "Lujo",
    cardBg: "bg-mesh-lujo",
    stampBg: "bg-amber-200 shadow-md",
    stampIcon: "text-slate-900",
    rewardBg: "bg-amber-300 shadow-lg shadow-amber-500/20",
    rewardIcon: "text-slate-900",
    emptyBorder: "border-slate-700/50",
    emptyText: "text-slate-600",
    textClass: "text-white/90 drop-shadow-sm",
    swatchPrimary: "bg-mesh-lujo",
    swatchSecondary: "bg-amber-200",
  },
  {
    id: "lujo-2",
    category: "Lujo",
    cardBg: "bg-[#1C2331]",
    stampBg: "bg-[#D4AF37]",
    stampIcon: "text-[#1C2331]",
    rewardBg: "bg-[#D4AF37]",
    rewardIcon: "text-[#1C2331]",
    emptyBorder: "border-[#3A4556]",
    emptyText: "text-[#3A4556]",
    textClass: "text-white",
    swatchPrimary: "bg-[#1C2331]",
    swatchSecondary: "bg-[#D4AF37]",
  },
  // VIBRANTE
  {
    id: "vibrante-mesh",
    category: "Vibrante",
    cardBg: "bg-mesh-vibrante",
    stampBg: "bg-white shadow-md",
    stampIcon: "text-emerald-700",
    rewardBg: "bg-emerald-300 shadow-lg shadow-emerald-500/30",
    rewardIcon: "text-emerald-900",
    emptyBorder: "border-emerald-300/30",
    emptyText: "text-emerald-200/50",
    textClass: "text-white font-black",
    swatchPrimary: "bg-mesh-vibrante",
    swatchSecondary: "bg-white",
  },
  {
    id: "vibrante-2",
    category: "Vibrante",
    cardBg: "bg-purple-600",
    stampBg: "bg-purple-100",
    stampIcon: "text-purple-600",
    rewardBg: "bg-purple-300",
    rewardIcon: "text-purple-900",
    emptyBorder: "border-purple-400",
    emptyText: "text-purple-400",
    textClass: "text-white",
    swatchPrimary: "bg-purple-600",
    swatchSecondary: "bg-purple-100",
  },
  // ALEGRE
  {
    id: "alegre-mesh",
    category: "Alegre",
    cardBg: "bg-mesh-alegre",
    stampBg: "bg-white shadow-md",
    stampIcon: "text-rose-600",
    rewardBg: "bg-orange-300 shadow-lg shadow-orange-500/30",
    rewardIcon: "text-orange-900",
    emptyBorder: "border-rose-300/40",
    emptyText: "text-rose-200/50",
    textClass: "text-white font-bold",
    swatchPrimary: "bg-mesh-alegre",
    swatchSecondary: "bg-white",
  },
  {
    id: "alegre-2",
    category: "Alegre",
    cardBg: "bg-amber-400",
    stampBg: "bg-amber-900",
    stampIcon: "text-amber-400",
    rewardBg: "bg-amber-950",
    rewardIcon: "text-amber-300",
    emptyBorder: "border-amber-300",
    emptyText: "text-amber-300",
    textClass: "text-amber-950",
    swatchPrimary: "bg-amber-400",
    swatchSecondary: "bg-amber-900",
  },
  // MINIMALISTA
  {
    id: "minimal-mesh",
    category: "Minimalista",
    cardBg: "bg-mesh-minimal",
    stampBg: "bg-slate-900 shadow-sm",
    stampIcon: "text-white",
    rewardBg: "bg-emerald-500 shadow-md shadow-emerald-500/20",
    rewardIcon: "text-white",
    emptyBorder: "border-slate-200",
    emptyText: "text-slate-300",
    textClass: "text-slate-900 font-medium",
    swatchPrimary: "bg-mesh-minimal border border-slate-200",
    swatchSecondary: "bg-slate-900",
  },
  {
    id: "neon-mesh",
    category: "Neón",
    cardBg: "bg-mesh-neon",
    stampBg: "bg-black shadow-[0_0_15px_rgba(255,255,255,0.3)]",
    stampIcon: "text-white",
    rewardBg: "bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]",
    rewardIcon: "text-black",
    emptyBorder: "border-white/20",
    emptyText: "text-white/20",
    textClass: "text-white font-black tracking-widest",
    swatchPrimary: "bg-mesh-neon",
    swatchSecondary: "bg-white",
  }
];

export function Step6Style({ data, updateData, onNext }: Props) {
  // Inicializamos la categoría activa basada en el estilo seleccionado, o por defecto "Lujo"
  const currentStyleObj = styles.find((s) => s.id === data.styleTheme) || styles[0];
  const [activeCategory, setActiveCategory] = useState(currentStyleObj.category);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const categories = ["Lujo", "Vibrante", "Alegre", "Minimalista", "Neón"];
  const currentCategoryStyles = styles.filter(s => s.category === activeCategory);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        // In a real app we'd save the base64 or upload to S3 and save URL to data
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wide uppercase mb-4 shadow-sm border border-blue-200 dark:border-blue-500/20">
          <Palette className="w-3.5 h-3.5" /> Apariencia Premium
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          Diseña tu tarjeta ideal
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
          Selecciona un fondo dinámico de alta gama y sube tu logo.
        </p>
      </div>

      {/* Live Preview Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStyleObj.id}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
          className={`w-full ${currentStyleObj.cardBg} rounded-[2rem] p-6 md:p-8 mb-10 shadow-2xl relative overflow-hidden ring-1 ring-white/10`}
        >
          {/* Card Noise Texture */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <label className="group relative cursor-pointer">
                {logoPreview ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-inner group-hover:bg-black/20 transition-all ${currentStyleObj.textClass}`}>
                    {data.businessName ? data.businessName.charAt(0).toUpperCase() : "T"}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg scale-0 group-hover:scale-100 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              <span className={`text-2xl font-black tracking-tight ${currentStyleObj.textClass}`}>
                {data.businessName || "Tu negocio"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 relative z-10 justify-start">
            {Array.from({ length: data.stampsCount || 8 }).map((_, i) => {
              const isFilled = i < 3;
              const isLast = i === (data.stampsCount || 8) - 1;
              const StampIcon = getBusinessIcon(data.businessType);

              return (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isFilled 
                      ? `${currentStyleObj.stampBg} ${currentStyleObj.stampIcon}` 
                      : isLast
                        ? `${currentStyleObj.rewardBg} ${currentStyleObj.rewardIcon}` 
                        : `border-2 border-dashed ${currentStyleObj.emptyBorder} ${currentStyleObj.emptyText} bg-black/5`
                  }`}
                >
                  {isFilled ? (
                    <StampIcon className="w-6 h-6" />
                  ) : isLast ? (
                    <Gift className="w-6 h-6" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Selector de Categorías (Pills) */}
      <div className="flex justify-center gap-2 mb-6 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full w-full overflow-x-auto snap-x hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-black transition-all whitespace-nowrap snap-center shrink-0 ${
              activeCategory === cat
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Swatches de la Categoría Activa */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-8 snap-x justify-center">
        <AnimatePresence mode="popLayout">
          {currentCategoryStyles.map((style) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => updateData({ styleTheme: style.id })}
              className={`snap-center shrink-0 w-20 h-24 rounded-2xl p-2 flex flex-col justify-between transition-all ${style.swatchPrimary} ${
                data.styleTheme === style.id
                  ? "ring-4 ring-emerald-500 ring-offset-4 ring-offset-white dark:ring-offset-slate-950 scale-105 shadow-xl"
                  : "hover:scale-105 hover:shadow-md border border-slate-200 dark:border-white/10"
              }`}
            >
              {/* Fake text lines for swatch */}
              <div className="w-full space-y-1.5 opacity-80 pl-1 pt-1">
                <div className={`h-1.5 w-10 rounded-full ${style.swatchSecondary}`}></div>
                <div className={`h-1 w-6 rounded-full ${style.swatchSecondary} opacity-50`}></div>
              </div>
              
              {/* Fake stamps for swatch */}
              <div className={`w-full h-7 rounded-xl bg-black/20 flex items-center justify-center gap-1`}>
                <div className={`w-2 h-2 rounded-full ${style.swatchSecondary}`}></div>
                <div className={`w-2 h-2 rounded-full ${style.swatchSecondary}`}></div>
                <div className={`w-2 h-2 rounded-full ${style.swatchSecondary}`}></div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
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
