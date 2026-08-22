import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 text-rose-500">
        <WifiOff size={48} />
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
        Estás desconectado
      </h1>
      
      <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
        Parece que has perdido la conexión a internet. LoyalPass requiere conexión para sincronizar los sellos y recompensas en tiempo real.
      </p>

      <Link 
        href="/"
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95"
      >
        <RefreshCw size={20} />
        Intentar conectar de nuevo
      </Link>
    </div>
  );
}
