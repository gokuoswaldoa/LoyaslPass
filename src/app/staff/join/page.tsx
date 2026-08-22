"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginStaff } from "@/app/actions/staff";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StaffJoinPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No se proporcionó un token válido.");
      return;
    }

    const processLogin = async () => {
      try {
        const res = await loginStaff(token);
        if (res.success) {
          setStatus("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          setStatus("error");
          setErrorMsg(res.error || "Código inválido");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg("Error al intentar iniciar sesión");
      }
    };

    processLogin();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 pb-8 px-8 flex flex-col items-center text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
              <h1 className="text-xl font-bold">Iniciando Sesión...</h1>
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
            </>
          )}

          {status === "success" && (
            <>
              <div className="h-16 w-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-xl font-bold">¡Bienvenido!</h1>
              <p className="text-slate-500">Redirigiendo al escáner...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
