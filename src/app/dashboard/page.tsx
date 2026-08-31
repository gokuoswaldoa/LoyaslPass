"use client";

import { useEffect, useState } from "react";
import { processOnboardingData } from "@/app/actions/saveOnboarding";
import { getDashboardStats } from "@/app/actions/dashboard";
import { useSession } from "next-auth/react";
import BusinessQR from "@/components/BusinessQR";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCustomers: 0, stampsToday: 0, totalStamps: 0 });
  const [afluenciaData, setAfluenciaData] = useState<{day: string, recurrentes: number, nuevos: number}[]>([]);
  const [horariosData, setHorariosData] = useState<{time: string, visitas: number}[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [timeRange, setTimeRange] = useState<"hoy" | "semana" | "mes">("hoy");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (status === "authenticated") {
        await processOnboardingData(); // Create business if needed
        const res = await getDashboardStats(timeRange);
        if (res.success && res.stats) {
          setStats(res.stats);
          if (res.businessId) setBusinessId(res.businessId);
          if (res.chartAfluencia) setAfluenciaData(res.chartAfluencia);
          if (res.chartHorarios) setHorariosData(res.chartHorarios);
        }
        setLoading(false);
      } else if (status === "unauthenticated") {
        window.location.href = "/";
      }
    }
    loadData();
  }, [status, timeRange]);

  if (loading || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-500 font-medium">Cargando...</p>
      </div>
    );
  }


  return (
    <div className="p-6 md:p-10 pb-32 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Hola, {session?.user?.name?.split(' ')[0] || "Dueño"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
            Aquí está el pulso de tu negocio el día de hoy.
          </p>
            <button onClick={() => window.dispatchEvent(new CustomEvent("openTutorial", { detail: { title: "Guarda la app en tu inicio", subtitle: "Agrega tu panel a la pantalla de inicio para administrar todo rápidamente como una app.", blocking: false, storageKey: "dashboardTutorialSeen", variant: "dashboard" } }))} className="text-emerald-600 dark:text-emerald-400 text-sm font-bold underline mt-2 hover:opacity-80 transition-opacity">¿No sabes cómo instalar la app? Ver tutorial</button>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
          <button 
            onClick={() => setTimeRange("hoy")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${timeRange === 'hoy' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Hoy
          </button>
          <button 
            onClick={() => setTimeRange("semana")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${timeRange === 'semana' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Esta semana
          </button>
          <button 
            onClick={() => setTimeRange("mes")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${timeRange === 'mes' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Mes
          </button>
        </div>
      </div>

      {/* --- QR DEL NEGOCIO --- */}
      {businessId && (
        <div id="tour-qr-registro" className="mb-10">
          <BusinessQR businessId={businessId} />
        </div>
      )}

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-slate-500 uppercase tracking-widest text-xs mb-1">Clientes Totales</h3>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-slate-500 uppercase tracking-widest text-xs mb-1">
              {timeRange === 'hoy' ? 'Sellos Hoy' : timeRange === 'semana' ? 'Sellos (Semana)' : 'Sellos (Mes)'}
            </h3>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.stampsToday}</p>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-6 md:p-8 rounded-[2rem] shadow-xl shadow-slate-900/10 flex flex-col justify-between group hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-bl-full blur-2xl"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center mb-6 relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-white/70 dark:text-slate-500 uppercase tracking-widest text-xs mb-1">Total Sellos Otorgados</h3>
            <p className="text-4xl font-black tracking-tighter">{stats.totalStamps}</p>
          </div>
        </div>
      </div>

      {/* --- CHARTS AREA (RECHARTS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfica 1: Afluencia (AreaChart) */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[420px]">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Afluencia y Lealtad</h3>
              <p className="text-sm font-medium text-slate-500">Nuevos vs Recurrentes (Tiempo Real)</p>
            </div>
            {stats.totalStamps === 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">Sin datos reales aún</span>
            )}
          </div>
          
          <div className="flex-1 w-full relative">
            {stats.totalStamps === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Aún no hay visitas</h4>
                <p className="text-sm text-slate-500 max-w-[200px] mt-1">Comparte tu código QR para comenzar a ver datos aquí.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={afluenciaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRecurrentes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                    cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 600, color: '#64748b' }} />
                  <Area type="monotone" name="Recurrentes" dataKey="recurrentes" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRecurrentes)" />
                  <Area type="monotone" name="Nuevos" dataKey="nuevos" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorNuevos)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfica 2: Horarios Pico (BarChart) */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[420px]">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Horarios Pico</h3>
              <p className="text-sm font-medium text-slate-500">Actividad por hora (Tiempo Real)</p>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            {stats.stampsToday === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Aún no hay visitas hoy</h4>
                <p className="text-sm text-slate-500 max-w-[200px] mt-1">Aquí verás qué horas son las más activas.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horariosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                  />
                  <Bar name="Visitas" dataKey="visitas" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
