"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "react-qr-code";
import { getClientWalletData } from "@/app/actions/clientFlow";

export default function ClientPassPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const walletPassId = params.walletPassId as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const res = await getClientWalletData(businessId, walletPassId);
      if (res.success) {
        setData(res);
      } else {
        if (res.error === "Cliente no encontrado") {
          localStorage.removeItem(`loyalpass_wallet_${businessId}`);
          router.push(`/${businessId}/join`);
          return;
        }
        setError(res.error || "No pudimos cargar la tarjeta.");
      }
      setLoading(false);
    }
    if (businessId && walletPassId) loadData();
  }, [businessId, walletPassId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Oops</h1>
        <p className="text-slate-500 font-medium">{error}</p>
      </div>
    );
  }

  const { customer, business, config, stampsCount } = data;
  const isRewardReady = stampsCount >= config.totalStampsRequired;

  // Generamos los huecos para sellos
  const renderStamps = () => {
    const stamps = [];
    for (let i = 0; i < config.totalStampsRequired; i++) {
      const isStamped = i < stampsCount;
      const isNext = i === stampsCount;
      
      stamps.push(
        <div 
          key={i} 
          className={`
            relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
            transition-all duration-500
            ${isStamped 
              ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110 z-10' 
              : 'bg-black/20 border-2 border-white/20'
            }
            ${isNext ? 'animate-pulse bg-white/10 border-white/40 border-dashed' : ''}
          `}
        >
          {isStamped ? (
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-white/30 font-black text-sm sm:text-base">{i + 1}</span>
          )}
        </div>
      );
    }
    return stamps;
  };

  return (
    <div className={`min-h-screen ${config.colorBackground} flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden`}>
      {/* Ambient background blur */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-20%] w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-black/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center z-10">
        
        {/* Apple Wallet Style Card */}
        <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden relative">
          
          {/* Top colored strip (optional accent) */}
          <div className="h-2 w-full bg-white/20"></div>

          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center p-2 border border-white/20 relative overflow-hidden shadow-lg">
                <Image src={config.logoUrl || "/logo/icono.png"} alt="Logo" fill className="object-contain" />
              </div>
              <div className="text-right text-white">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Sello Digital</p>
                <p className="font-black text-xl leading-tight">{business.name}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8 border-l-4 border-white/30 pl-4">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Titular</p>
              <p className="text-white font-black text-2xl drop-shadow-sm">{customer.name}</p>
            </div>

            {/* Reward Alert */}
            {isRewardReady && (
              <div className="mb-8 p-4 bg-white rounded-xl shadow-lg flex items-center justify-center gap-3 animate-bounce">
                <span className="text-2xl">🎁</span>
                <p className="font-black text-slate-900 text-lg">¡Recompensa Desbloqueada!</p>
              </div>
            )}

            {/* Stamps Grid */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <p className="text-white/80 font-bold">{config.rewardText}</p>
                <p className="text-white font-black bg-white/20 px-3 py-1 rounded-lg text-sm">
                  {stampsCount} / {config.totalStampsRequired}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-y-6 gap-x-2 justify-items-center">
                {renderStamps()}
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-200 opacity-50"></div>
              <div className="relative z-10 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                <QRCode 
                  value={customer.walletPassId} 
                  size={140}
                  level="H"
                  className="opacity-90 transition-opacity duration-300"
                />
              </div>
              <p className="relative z-10 text-slate-500 font-bold mt-4 tracking-widest text-xs uppercase text-center">
                Muestra este código<br/>para recibir tu sello
              </p>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8 w-full max-w-sm justify-center items-center">
          <button 
            onClick={() => alert("📱 En iPhone:\n\nToca el ícono de 'Compartir' en la barra inferior (el cuadrito con la flecha hacia arriba) y selecciona 'Agregar a Inicio'. \n\nEsto guardará tu tarjeta permanentemente junto a tus apps.")}
            className="hover:scale-105 transition-transform drop-shadow-xl"
          >
            <Image 
              src="/material/add-to-apple-wallet-logo.png" 
              alt="Agregar a Apple Wallet" 
              width={200} 
              height={60} 
              className="h-14 w-auto" 
            />
          </button>
          
          <button 
            onClick={() => window.open(`/api/wallet/google/${walletPassId}`, '_blank')}
            className="hover:scale-105 transition-transform drop-shadow-xl"
          >
            <Image 
              src="/material/Add_to_Google_Wallet_badge.svg.webp" 
              alt="Agregar a Google Wallet" 
              width={200} 
              height={60} 
              className="h-14 w-auto" 
            />
          </button>
        </div>

      </div>
    </div>
  );
}
