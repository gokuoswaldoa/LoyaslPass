"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getBusinessOnboardingData, registerCustomer } from "@/app/actions/clientFlow";
import { User, Phone, Mail, ArrowRight, Calendar } from "lucide-react";

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirección automática si ya tiene su tarjeta guardada en este dispositivo
  useEffect(() => {
    const savedWalletId = localStorage.getItem(`loyalpass_wallet_${businessId}`);
    if (savedWalletId) {
      router.push(`/${businessId}/pass/${savedWalletId}`);
    }
  }, [businessId, router]);

  // Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getBusinessOnboardingData(businessId);
      if (res.success) {
        setBusinessData(res.business);
        setConfig(res.config);
      } else {
        setError(res.error || "No pudimos cargar la información.");
      }
      setLoading(false);
    }
    if (businessId) loadData();
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await registerCustomer(businessId, name, phone, email, birthdate);
    if (res.success && res.walletPassId) {
      // Guardar localmente para que no se pierda al cerrar la pestaña
      localStorage.setItem(`loyalpass_wallet_${businessId}`, res.walletPassId);
      // Redirigir a la tarjeta del cliente (usamos window.location.href para bypasear el Next.js Client Router Cache)
      window.location.href = `/${businessId}/pass/${res.walletPassId}`;
    } else {
      setError(res.error || "Hubo un problema al registrarte.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !businessData || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Oops</h1>
        <p className="text-slate-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${config.colorBackground} flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden transition-colors duration-1000`}>
      {/* Ambient background blur */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-black/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-3xl p-3 flex items-center justify-center mb-6 shadow-xl border border-white/30 relative overflow-hidden">
            <Image src={config.logoUrl || "/logo/icono.png"} alt="Logo" fill className="object-contain drop-shadow-md p-2" />
          </div>
          <h1 className="text-3xl font-black text-white drop-shadow-sm leading-tight mb-2">
            Únete a {businessData.name}
          </h1>
          <p className="text-white/80 font-medium">
            Regístrate rápido y obtén tu {config.rewardText || "recompensa gratis"} al completar {config.totalStampsRequired} sellos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <User size={20} className="text-white/60" />
            </div>
            <input 
              type="text" 
              placeholder="Tu Nombre" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-black/30 text-white placeholder:text-white/50 font-bold transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Phone size={20} className="text-white/60" />
            </div>
            <input 
              type="tel" 
              placeholder="Número de Teléfono" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-black/30 text-white placeholder:text-white/50 font-bold transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail size={20} className="text-white/60" />
            </div>
            <input 
              type="email" 
              placeholder="Correo Electrónico (Opcional)" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-black/30 text-white placeholder:text-white/50 font-bold transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Calendar size={20} className="text-white/60" />
            </div>
            <input 
              type="text" 
              placeholder="Fecha de Nacimiento" 
              required
              value={birthdate}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full min-w-0 max-w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-black/30 text-white placeholder:text-white/50 font-bold transition-all [color-scheme:dark]"
            />
          </div>

          {error && <p className="text-red-300 bg-red-900/30 p-3 rounded-xl font-bold text-center text-sm border border-red-500/20">{error}</p>}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 mt-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? "Generando Tarjeta..." : <>Obtener mi Tarjeta <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>

      <p className="mt-8 text-white/50 font-semibold text-sm tracking-widest uppercase">Powered by LoyalPass</p>
    </div>
  );
}
