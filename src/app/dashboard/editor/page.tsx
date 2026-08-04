"use client";

import { useState, useEffect, useRef } from "react";
import { getPassConfig, savePassConfig } from "@/app/actions/editor";
import { Save, Upload, CheckCircle2, Apple, Ticket, Gift } from "lucide-react";
import Image from "next/image";

// Predefined Themes for the Wallet Pass
const THEMES = [
  { id: "emerald", name: "Esmeralda", classes: "bg-gradient-to-br from-emerald-400 to-teal-700" },
  { id: "midnight", name: "Midnight", classes: "bg-gradient-to-br from-slate-800 to-black" },
  { id: "purple", name: "Ultra Violeta", classes: "bg-gradient-to-br from-violet-500 to-fuchsia-700" },
  { id: "sunset", name: "Atardecer", classes: "bg-gradient-to-br from-orange-400 to-rose-600" },
  { id: "ocean", name: "Océano Profundo", classes: "bg-gradient-to-br from-blue-500 to-indigo-800" },
];

export default function EditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [businessName, setBusinessName] = useState("Mi Negocio");
  
  const [config, setConfig] = useState({
    styleTheme: "emerald",
    colorBackground: "bg-gradient-to-br from-emerald-400 to-teal-700",
    colorText: "#FFFFFF",
    totalStampsRequired: 8,
    rewardText: "¡Premio Gratis!",
    logoUrl: "/logo/icono.png",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadConfig() {
      const res = await getPassConfig();
      if (res.success && res.config) {
        if (res.businessName) setBusinessName(res.businessName);
        setConfig({
          styleTheme: res.config.styleTheme || "emerald",
          colorBackground: res.config.colorBackground || "bg-gradient-to-br from-emerald-400 to-teal-700",
          colorText: res.config.colorText || "#FFFFFF",
          totalStampsRequired: res.config.totalStampsRequired || 8,
          rewardText: res.config.rewardText || "¡Premio Gratis!",
          logoUrl: res.config.logoUrl || "/logo/icono.png",
        });
      }
      setLoading(false);
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await savePassConfig({ ...config, businessName });
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-500 font-medium">Cargando editor...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 pb-32 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
      
      {/* LEFT PANEL: CONTROLS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Diseño del Pase
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
            Personaliza cómo se verá tu tarjeta en Apple Wallet y Google Wallet.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
          
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">
              Logotipo del Negocio
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 overflow-hidden relative">
                <Image src={config.logoUrl} alt="Logo" fill className="object-contain" />
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleLogoUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
              >
                <Upload className="w-4 h-4" /> Subir Logo
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Business Name */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">
              Nombre del Negocio
            </label>
            <input 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ej. Mi Cafetería"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none font-medium text-slate-900 dark:text-white"
            />
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">
              Estilo y Colores
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setConfig({ ...config, styleTheme: theme.id, colorBackground: theme.classes })}
                  className={`relative h-20 rounded-xl overflow-hidden group border-4 transition-all ${
                    config.styleTheme === theme.id ? 'border-emerald-500 shadow-lg scale-105' : 'border-transparent hover:scale-105'
                  }`}
                >
                  <div className={`absolute inset-0 ${theme.classes} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="text-white font-bold text-xs shadow-sm drop-shadow-md">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Game Logic */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">
              Mecánica de Recompensa
            </label>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">¿Cuántos sellos para el premio?</label>
                <div className="flex gap-2">
                  {[5, 8, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setConfig({ ...config, totalStampsRequired: num })}
                      className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                        config.totalStampsRequired === num 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {num} Sellos
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">¿Cuál es el premio?</label>
                <input 
                  type="text" 
                  value={config.rewardText}
                  onChange={(e) => setConfig({ ...config, rewardText: e.target.value })}
                  placeholder="Ej. Café Gratis"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`mt-4 w-full py-4 rounded-xl font-black text-lg text-white flex items-center justify-center gap-2 transition-all ${
              saveSuccess ? 'bg-emerald-500' : 'bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
            }`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
            ) : saveSuccess ? (
              <><CheckCircle2 className="w-5 h-5" /> Guardado Correctamente</>
            ) : (
              <><Save className="w-5 h-5" /> Guardar Cambios</>
            )}
          </button>

        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        <div className="sticky top-28 flex flex-col items-center">
          
          <div className="mb-6 flex items-center gap-2 text-slate-400 font-bold tracking-widest text-sm uppercase">
            <Apple className="w-5 h-5" />
            <span>Previsualización en vivo</span>
          </div>

          {/* IPHONE MOCKUP */}
          <div className="relative w-[320px] h-[650px] bg-black rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col shadow-emerald-500/10">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
              <div className="w-32 h-6 bg-slate-800 rounded-b-3xl"></div>
            </div>

            {/* Apple Wallet Header */}
            <div className="pt-12 px-6 pb-4 flex justify-between items-center bg-black text-white">
              <span className="font-semibold">Billetera</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">+</div>
            </div>

            {/* THE PASS */}
            <div className={`mx-4 mt-2 h-[450px] rounded-3xl p-6 flex flex-col relative overflow-hidden ${config.colorBackground} text-white shadow-xl transform transition-colors duration-500`}>
              
              {/* Glassmorphism overlays */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

              {/* Pass Header */}
              <div className="flex justify-between items-start relative z-10">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center p-2 backdrop-blur-md border border-white/20 relative overflow-hidden">
                  <Image src={config.logoUrl} alt="Logo" fill className="object-contain" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Sello Digital</p>
                  <p className="font-black text-xl">{businessName}</p>
                </div>
              </div>

              {/* Stamps Area */}
              <div className="flex-1 flex flex-col justify-center items-center relative z-10 mt-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 w-full">
                  <p className="text-center font-bold text-sm mb-4 opacity-90">{config.totalStampsRequired} Sellos = {config.rewardText}</p>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    {Array.from({length: config.totalStampsRequired}).map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                        {/* Simular 2 sellos estampados */}
                        {i < 2 ? (
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center animate-bounce shadow-lg">
                            <Ticket className={`w-4 h-4 text-slate-900`} />
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="mt-auto bg-white rounded-xl p-4 flex flex-col items-center relative z-10 shadow-lg">
                <div className="w-full h-12 bg-[repeating-linear-gradient(to_right,#000,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_8px,transparent_8px,transparent_10px)] opacity-80 mb-2"></div>
                <p className="text-xs text-black font-bold font-mono tracking-widest">A7F9-3B2X</p>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
