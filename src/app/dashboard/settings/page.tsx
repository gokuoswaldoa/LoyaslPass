"use client";

import { CreditCard, FileText, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-10 pb-32 w-full max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Configuración
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
          Administra la cuenta y ajustes de facturación de tu negocio.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Datos Fiscales</h2>
            <p className="text-slate-500 text-sm font-medium">Información para emitir tus facturas (RFC, Razón Social, etc.)</p>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
          <SettingsIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Esta sección estará disponible próximamente.</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Suscripción</h2>
            <p className="text-slate-500 text-sm font-medium">Gestiona tu plan de pago y métodos de cobro.</p>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
          <SettingsIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Esta sección estará disponible próximamente.</p>
        </div>
      </div>
    </div>
  );
}
