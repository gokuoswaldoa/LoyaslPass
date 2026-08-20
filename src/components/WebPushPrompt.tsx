"use client";

import { useState, useEffect } from "react";
import { saveWebPushSubscription } from "@/app/actions/webpush";

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function WebPushPrompt({ walletPassId, businessName }: { walletPassId: string, businessName: string }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true); // default to true until checked

  useEffect(() => {
    // Only run on client
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        if (sub === null) {
          // Check if we previously dismissed it
          const dismissed = localStorage.getItem('loyalpass_push_dismissed');
          if (!dismissed) {
            setIsSubscribed(false);
            // Show after a small delay for better UX
            setTimeout(() => setShowPrompt(true), 1500);
          }
        }
      });
    });
  }, []);

  const handleSubscribe = async () => {
    setShowPrompt(false);
    
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert("Permiso de notificaciones denegado por el navegador.");
          return;
        }
      }

      const reg = await navigator.serviceWorker.ready;
      if (!reg.pushManager) {
        alert("Tu navegador no soporta PushManager (o estás en modo incógnito).");
        return;
      }
      
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicVapidKey) {
        console.error("VAPID public key not found");
        alert("Falta la configuración de notificaciones en el servidor.");
        return;
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      const res = await saveWebPushSubscription(walletPassId, subscription);
      if (res.success) {
        alert("¡Alertas activadas exitosamente!");
      } else {
        alert("Error: " + res.error);
      }
      
    } catch (e) {
      console.error("Error subscribing to push:", e);
      alert("No se pudo activar las alertas. ¿El navegador las bloquea?");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('loyalpass_push_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-white/20 backdrop-blur-xl border border-white/30 p-8 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden"
        style={{
          borderRadius: "50% 50% 50% 0", // Teardrop / Gota de agua effect
          width: "280px",
          height: "280px",
          transform: "rotate(45deg)", // Rotate the teardrop
        }}
      >
        <div style={{ transform: "rotate(-45deg)" }} className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight mb-2">
            Activa las alertas
          </h3>
          <p className="text-white/80 text-xs mb-5 font-medium px-2">
            Sé el primero en enterarte de las recompensas en {businessName}.
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={handleDismiss}
              className="px-4 py-2 rounded-full bg-black/20 text-white text-xs font-bold hover:bg-black/40 transition-colors"
            >
              Quizás luego
            </button>
            <button 
              onClick={handleSubscribe}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-colors shadow-lg"
            >
              ¡Sí, Activar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
