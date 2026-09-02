"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Copy, ExternalLink, Check, Download } from "lucide-react";
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

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    
    img.onload = () => {
      // Add padding and white background
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        
        const pngFile = canvas.toDataURL("image/png");
        
        // Convert to blob for mobile support (Web Share API)
        fetch(pngFile)
          .then(res => res.blob())
          .then(async (blob) => {
            const file = new File([blob], "QR_LoyalPass.png", { type: "image/png" });
            
            // Check if Web Share API with files is supported (mostly mobile/PWAs)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: 'QR de Registro - LoyalPass',
                });
              } catch (error) {
                console.error("Error compartiendo:", error);
                // Fallback to manual download if share fails (e.g. user cancelled)
                triggerFallbackDownload(pngFile);
              }
            } else {
              // Fallback for Desktop browsers
              triggerFallbackDownload(pngFile);
            }
          });
          
        const triggerFallbackDownload = (url: string) => {
          const downloadLink = document.createElement("a");
          downloadLink.download = "QR_Registro_LoyalPass.png";
          downloadLink.href = url;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!qrUrl) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
      <div className="bg-slate-50 dark:bg-white p-4 rounded-2xl shadow-inner shrink-0">
        <QRCode id="qr-code-svg" value={qrUrl} size={150} level="H" />
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
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold transition-colors"
          >
            <Download size={18} />
            Descargar QR
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
