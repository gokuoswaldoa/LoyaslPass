"use client";

import { useState, useEffect } from "react";
import { Send, Smartphone, Zap, Sparkles, Users, MessageSquare, BellRing, Filter, Search, MapPin, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getPassConfig } from "@/app/actions/editor";
import { getCustomers } from "@/app/actions/dashboard";
import { sendPushNotification, updateBusinessLocation } from "@/app/actions/marketing";

const TEMPLATES = [
  { id: 1, label: "Oferta Flash 2x1", message: "¡Hoy es tu día de suerte! Ven y disfruta un 2x1 en toda la tienda. Solo válido hoy hasta cerrar.", icon: Zap },
  { id: 2, label: "Feliz Cumpleaños", message: "¡Feliz cumpleaños! Pasa hoy a celebrar con nosotros, tu bebida de cortesía te está esperando.", icon: Sparkles },
  { id: 3, label: "Te extrañamos", message: "Hace tiempo que no te vemos. Regresa esta semana y recibe el doble de sellos en tu pase.", icon: BellRing },
];

export default function MarketingPage() {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "riesgo" | "vip" | "cumple">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const [businessName, setBusinessName] = useState("LoyalPass");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [customers, setCustomers] = useState<{ id: string; name: string; phone: string | null; stamps: number; status: string; walletPassId: string | null; businessId: string | null; birthdate: string | null; totalStampsRequired: number; }[]>([]);

  const [address, setAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const res = await updateBusinessLocation(position.coords.latitude.toString(), position.coords.longitude.toString());
        setLocationLoading(false);
        if (res.success) {
          alert("¡Ubicación GPS guardada! Tus clientes recibirán alertas al pasar cerca.");
        } else {
          alert("Error al guardar la ubicación");
        }
      }, () => {
        setLocationLoading(false);
        alert("Por favor habilita los permisos de ubicación en tu navegador.");
      });
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  };

  const handleSearchAddress = async () => {
    if (!address) return;
    setLocationLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const res = await updateBusinessLocation(lat, lon);
        if (res.success) {
          alert("¡Dirección encontrada y guardada con éxito!");
        } else {
          alert("Error al guardar la ubicación.");
        }
      } else {
        alert("No pudimos encontrar esta dirección, por favor sé más específico.");
      }
    } catch (err) {
      alert("Error al buscar la dirección.");
    }
    setLocationLoading(false);
  };

  useEffect(() => {
    async function loadData() {
      const resConfig = await getPassConfig();
      if (resConfig.success) {
        if (resConfig.businessName) setBusinessName(resConfig.businessName);
        if (resConfig.config?.logoUrl) setLogoUrl(resConfig.config.logoUrl);
      }
      
      const resCustomers = await getCustomers();
      if (resCustomers.success && resCustomers.customers) {
        setCustomers(resCustomers.customers);
      }
    }
    loadData();
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    // 1. Text Search Filter
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 2. Status Filter
    if (target === "riesgo" && c.status !== "Riesgo") return false;
    if (target === "vip" && c.status !== "VIP") return false;
    if (target === "cumple") {
      if (!c.birthdate) return false;
      // Check if birthdate month matches current month
      const birthDateObj = new Date(c.birthdate + "T00:00:00");
      const currentMonth = new Date().getMonth();
      if (birthDateObj.getMonth() !== currentMonth) return false;
    }
    
    return true;
  });

  const handleSend = async () => {
    if (!message) return;
    setSending(true);
    try {
      const res = await sendPushNotification(message, target);
      setSending(false);
      
      if (res.success) {
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setMessage("");
        alert(`¡Mensaje enviado a ${res.sent} dispositivos exitosamente!`);
      } else {
        alert("Error al enviar notificación: " + res.error);
      }
    } catch (err) {
      setSending(false);
      alert("Error de conexión con el servidor. Intenta de nuevo.");
    }
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

        {/* Target Selection & Filters */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">¿A quién se lo enviamos?</h3>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar por nombre..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <select 
              value={target}
              onChange={(e) => setTarget(e.target.value as "all" | "riesgo" | "vip" | "cumple")}
              className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="all">Todos los clientes</option>
              <option value="riesgo">En Riesgo (30+ días sin visita)</option>
              <option value="vip">VIP (Tarjeta llena)</option>
              <option value="cumple">Cumpleañeros (Este mes)</option>
            </select>
          </div>

          {/* Target Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                  {filteredCustomers.length} {filteredCustomers.length === 1 ? "Cliente seleccionado" : "Clientes seleccionados"}
                </h4>
                <p className="text-sm text-slate-500 font-medium line-clamp-1">
                  {filteredCustomers.length > 0 
                    ? `Ej: ${filteredCustomers.slice(0, 3).map(c => c.name).join(', ')}${filteredCustomers.length > 3 ? '...' : ''}`
                    : "Ningún cliente coincide con los filtros."}
                </p>
              </div>
            </div>
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

        {/* Panel Inteligente de Ubicación (Geolocalización) */}
        <div className="mt-12 mb-10 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <MapPin className="w-32 h-32 text-emerald-500" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-500" /> Alertas Automáticas (GPS)
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
            Ingresa la ubicación de tu local. Cuando un cliente pase cerca, su celular vibrará automáticamente recordándole que te visite.
          </p>
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ej. Insurgentes Sur 253, CDMX"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white font-medium"
              />
              <button 
                onClick={handleSearchAddress}
                disabled={locationLoading || !address}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Buscar
              </button>
            </div>
            
            <div className="flex items-center gap-4 my-2">
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-sm font-bold text-slate-400 uppercase">O usa el GPS de tu equipo</span>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <button 
              onClick={handleGetCurrentLocation}
              disabled={locationLoading}
              className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 transition-colors flex justify-center items-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Obtener mi ubicación actual
            </button>
          </div>
        </div>
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
