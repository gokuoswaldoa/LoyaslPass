"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle mesh gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-300/10 dark:bg-emerald-300/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-slate-950/[0.02] dark:bg-white/[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Volver al sitio
      </Link>

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] z-10 px-6">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-full max-w-sm h-24 md:h-28 bg-white/50 dark:bg-slate-900/50 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 mb-4 relative group">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Image 
              src="/logo/loyalpass-logo-full.svg" 
              alt="LoyalPass Logo" 
              fill
              className="dark:invert object-contain p-2 relative z-10" 
            />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-center text-lg">
            Plataforma de Lealtad Digital
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/50 dark:border-slate-800/50 relative">
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Iniciar Sesión</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Accede a tu panel de control</p>
          </div>

          <button 
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full relative group flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all overflow-hidden"
          >
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-700/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-slate-900 dark:text-white font-bold text-[15px]">Continuar con Google</span>
            </div>
          </button>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ¿No tienes cuenta?{" "}
              <Link href="/onboarding" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition-all">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 mt-8">
          Al iniciar sesión, aceptas nuestros Términos de Servicio y Política de Privacidad.
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
