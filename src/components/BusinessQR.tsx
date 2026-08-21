"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Copy, ExternalLink, Check } from "lucide-react";
import Link from "next/link";

interface BusinessQRProps {
  businessId: string;
}

export default function BusinessQR({ businessId }: BusinessQRProps) {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generate URL dynamically based on where we are hosted
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQrUrl(`${origin}/${businessId}/join`);
    }
  }, [businessId]);

  const copyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!qrUrl) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
      <div className="bg-slate-50 dark:bg-white p-4 rounded-2xl shadow-inner shrink-0">
        <QRCode value={qrUrl} size={150} level="H" />
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          QR de Registro
        </h3>
        <p className="text-slate-500 font-medium mb-4">
          Muestra este código a tus clientes nuevos para que se registren y obtengan su Tarjeta Digital en segundos.
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <button 
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors"
          >
            {copied ? <Check size={18} className="text-emerald-500"/> : <Copy size={18} />}
            {copied ? "Copiado" : "Copiar Link"}
          </button>
          
          <Link 
            href={qrUrl} 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors"
          >
            <ExternalLink size={18} />
            Probar Flujo
          </Link>
        </div>
      </div>
    </div>
  );
}
