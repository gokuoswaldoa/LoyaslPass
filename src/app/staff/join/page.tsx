"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginStaff } from "@/app/actions/staff";
import { Suspense } from "react";
import { Loader2, AlertTriangle, CheckCircle2, UserCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InstallTutorialModal from "@/components/InstallTutorialModal";

function StaffJoinContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "error" | "success" | "manual">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check PWA tutorial for staff
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const hasSeenTutorial = localStorage.getItem("staffTutorialSeen") === "true";
    
    if (!isStandalone && !hasSeenTutorial) {
      setTimeout(() => {
        alert("Antes de ingresar tu código de acceso es necesario añadir el acceso directo a tu pantalla de inicio.");
        window.dispatchEvent(new CustomEvent("openTutorial", {
          detail: {
            title: "Instala tu Portal",
            subtitle: "Agrega el portal de empleados a tu pantalla de inicio para escanear más rápido.",
            blocking: true,
            storageKey: "staffTutorialSeen"
          }
        }));
      }, 500);
    }

    if (!token) {
      setStatus("manual");
      return;
    }

    const processLogin = async () => {
      try {
        const res = await loginStaff(token);
        if (res.success) {
          setStatus("success");
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1500);
        } else {
          setStatus("error");
          setErrorMsg(res.error || "Codigo invalido");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg("Error al intentar iniciar sesion");
      }
    };

    processLogin();
  }, [token, router]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;
    
    setIsSubmitting(true);
    try {
      const res = await loginStaff(pin.toUpperCase());
      if (res.success) {
        setStatus("success");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);
      } else {
        setStatus("error");
        setErrorMsg(res.error || "PIN invalido o caducado");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Error al intentar iniciar sesion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <InstallTutorialModal />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">LoyalPass</h1>
        <p className="text-slate-500 font-medium">Portal de Empleados</p>
      </div>
      
      <Card className="w-full max-w-sm">
        <CardContent className="pt-8 pb-8 px-8 flex flex-col items-center text-center space-y-4">
          
          {status === "manual" && (
            <form onSubmit={handleManualLogin} className="w-full space-y-4">
              <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-2">
                <UserCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold">Ingresa tu PIN</h2>
              <p className="text-slate-500 text-sm">Escribe el PIN de 6 caracteres proporcionado por tu administrador.</p>
              
              <div className="pt-2 pb-4">
                <input 
                  type="text" 
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.toUpperCase())}
                  placeholder="Ej. A8F3B9"
                  className="w-full text-center text-2xl tracking-widest font-bold uppercase p-3 border-2 border-slate-200 dark:border-slate-800 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                  required
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting || pin.length !== 6} className="w-full bg-blue-500 hover:bg-blue-600 h-12 text-md">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Entrar al Escaner"}
              </Button>
            </form>
          )}

          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
              <h1 className="text-xl font-bold">Iniciando Sesion...</h1>
              <p className="text-slate-500">Por favor, espera un momento.</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="h-16 w-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle size={32} />
              </div>
              <h1 className="text-xl font-bold">Acceso Denegado</h1>
              <p className="text-slate-500">{errorMsg}</p>
              <Button onClick={() => setStatus("manual")} variant="outline" className="mt-4 w-full">
                Intentar con PIN
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <div className="h-16 w-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-xl font-bold">Bienvenido!</h1>
              <p className="text-slate-500">Redirigiendo al escaner...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffJoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>}>
      <StaffJoinContent />
    </Suspense>
  );
}

