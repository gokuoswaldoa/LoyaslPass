"use client";

import { useState } from "react";
import { Send, Smartphone, Zap, Sparkles, Users, MessageSquare, BellRing, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getPassConfig } from "@/app/actions/editor";
import { useEffect } from "react";

const TEMPLATES = [
  { id: 1, label: "Oferta Flash 2x1", message: "¡Hoy es tu día de suerte! Ven y disfruta un 2x1 en toda la tienda. Solo válido hoy hasta cerrar.", icon: Zap },
  { id: 2, label: "Feliz Cumpleaños", message: "¡Feliz cumpleaños! Pasa hoy a celebrar con nosotros, tu bebida de cortesía te está esperando.", icon: Sparkles },
  { id: 3, label: "Te extrañamos", message: "Hace tiempo que no te vemos. Regresa esta semana y recibe el doble de sellos en tu pase.", icon: BellRing },
];

export default function MarketingPage() {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "selected">("all");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const [businessName, setBusinessName] = useState("LoyalPass");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const res = await getPassConfig();
      if (res.success) {
        if (res.businessName) setBusinessName(res.businessName);
        if (res.config?.logoUrl) setLogoUrl(res.config.logoUrl);
      }
    }
    loadConfig();
  }, []);

  const handleSend = () => {
    if (!message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setMessage("");
    }, 1500);
  };

  return (
    <div className="p-6 md:p-10 pb-32 w-full max-w-7xl mx-auto flex flex-col xl:flex-row gap-10">
      
      {/* --- EDITOR DE CAMPAÑA --- */}
      <div className="flex-1">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Notificaciones Push
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
            Aumenta tus ventas al instante enviando un mensaje directo a la pantalla de bloqueo de tus clientes.
          </p>
        </div>

        {/* Templates */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Mensajes Rápidos</h3>
          <div className="flex flex-wrap gap-3">
            {TEMPLATES.map(t => (
              <button 
                key={t.id}
                onClick={() => setMessage(t.message)}
                className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Box */}
        <div className="mb-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-2">
          <div className="p-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-slate-900 dark:text-white">Mensaje a enviar</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí o elige una plantilla arriba..."
            className="w-full h-32 p-4 bg-transparent border-none resize-none focus:outline-none text-lg text-slate-900 dark:text-white placeholder-slate-400 font-medium"
            maxLength={140}
          />
          <div className="p-4 flex justify-end">
            <span className={`text-sm font-bold ${message.length > 120 ? 'text-orange-500' : 'text-slate-400'}`}>
              {message.length} / 140
            </span>
          </div>
        </div>

        {/* Target Selection */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">¿A quién se lo enviamos?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setTarget("all")}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                target === "all" 
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md ring-4 ring-emerald-500/10" 
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                target === "all" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <h4 className={`font-black text-lg mb-1 ${target === "all" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                Todos los Clientes
              </h4>
              <p className={`text-sm font-medium ${target === "all" ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-slate-500"}`}>
                Llega a tus 1,248 clientes actuales.
              </p>
            </button>

            <button 
              onClick={() => setTarget("selected")}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                target === "selected" 
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md ring-4 ring-emerald-500/10" 
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                target === "selected" ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}>
                <Filter className="w-5 h-5" />
              </div>
              <h4 className={`font-black text-lg mb-1 ${target === "selected" ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                Clientes Específicos
              </h4>
              <p className={`text-sm font-medium ${target === "selected" ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-slate-500"}`}>
                Filtrar por VIP, en riesgo, etc.
              </p>
            </button>
          </div>
        </div>

        {/* Send Action */}
        <button
          onClick={handleSend}
          disabled={!message || sending || sent}
          className="w-full py-5 rounded-[1.5rem] bg-emerald-600 text-white font-black hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all flex justify-center items-center gap-3 shadow-xl shadow-emerald-500/30 active:scale-[0.98] text-lg"
        >
          {sending ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : sent ? (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ¡Campaña Enviada!
            </>
          ) : (
            <>
              <Send className="w-6 h-6" /> Enviar Push
            </>
          )}
        </button>
      </div>

      {/* --- PREVIEW IPHONE --- */}
      <div className="w-full xl:w-[400px] flex justify-center mt-10 xl:mt-0">
        <div className="w-[320px] h-[650px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl relative border-[8px] border-slate-800 overflow-hidden flex flex-col">
          {/* Wallpaper */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
              alt="iOS Wallpaper" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>

          {/* Notch & Status Bar */}
          <div className="relative z-10 flex justify-center mb-10 mt-1">
            <div className="w-32 h-6 bg-black rounded-full absolute top-0"></div>
            <div className="w-full flex justify-between px-4 mt-2 text-white text-xs font-medium">
              <span>9:41</span>
              <div className="flex gap-1.5 items-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L23.6 7C22.6 6.1 18 2 12 2C6 2 1.4 6.1 0.4 7L12 21Z"></path></svg>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14.5C15.5 15.3 14.8 16 14 16H3C2.2 16 1.5 15.3 1.5 14.5V4.5C1.5 3.7 2.2 3 3 3H14C14.8 3 15.5 3.7 15.5 4.5V14.5ZM17 6V13L21 17V2L17 6Z"></path></svg>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z"></path></svg>
              </div>
            </div>
          </div>

          {/* Lockscreen Time */}
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-[4rem] leading-none font-bold text-white/90 font-sans tracking-tight">9:41</h2>
            <p className="text-white/80 font-medium mt-1">Domingo, 2 de Agosto</p>
          </div>

          {/* Notifications Area */}
          <div className="relative z-10 flex-1 flex flex-col justify-end pb-8">
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-full bg-white/90 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-2xl mx-auto flex gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 relative overflow-hidden border border-slate-700">
                    {logoUrl ? (
                      <Image src={logoUrl} alt="Logo" fill className="object-cover" />
                    ) : (
                      businessName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[13px] text-slate-900">{businessName}</span>
                      <span className="text-[11px] text-slate-500">ahora</span>
                    </div>
                    <h4 className="font-bold text-[14px] leading-tight text-slate-800 mb-0.5">¡Aviso importante!</h4>
                    <p className="text-[14px] leading-snug text-slate-700">
                      {message}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 flex justify-between px-6 pb-2">
            <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10 w-1/3 h-1 bg-white mx-auto rounded-full mt-4"></div>
        </div>
      </div>
    </div>
  );
}
