"use client";

import { Search, Filter, MoreVertical, Star, History, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getCustomers } from "@/app/actions/dashboard";

type Customer = {
  id: string;
  name: string;
  phone: string | null;
  stamps: number;
  status: string;
  walletPassId: string | null;
  totalStampsRequired?: number;
};

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      const res = await getCustomers();
      if (res.success && res.customers) {
        setClients(res.customers);
      }
      setLoading(false);
    }
    loadCustomers();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="p-6 md:p-10 pb-32 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Base de Clientes
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
            Conoce a tus clientes, recompensa su lealtad y aumenta su retención.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20">
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o teléfono..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap">
              <Filter className="w-4 h-4" /> Todos
            </button>
            <button className="px-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap">
              VIP
            </button>
            <button className="px-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap">
              En Riesgo
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-widest text-slate-400">
                <th className="p-6 font-bold">Cliente</th>
                <th className="p-6 font-bold">Estado</th>
                <th className="p-6 font-bold">Progreso (Sellos)</th>
                <th className="p-6 font-bold">Historial</th>
                <th className="p-6 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 font-bold">Cargando clientes...</td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 font-bold">No se encontraron clientes.</td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{client.name}</p>
                          <p className="text-sm text-slate-500 font-medium">{client.phone || "Sin teléfono"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        client.status === 'VIP' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                        client.status === 'Riesgo' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                        client.status === 'Nuevo' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {Array.from({length: client.totalStampsRequired || 8}).map((_, i) => (
                            <div key={i} className={`w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                              i < client.stamps ? 'bg-emerald-500 z-10' : 'bg-slate-200 dark:bg-slate-700'
                            }`}>
                              {i < client.stamps && <Star className="w-2.5 h-2.5 text-white" />}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500 ml-2">{client.stamps}/{client.totalStampsRequired || 8}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="font-semibold text-slate-900 dark:text-white">Última actividad</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <History className="w-3.5 h-3.5" /> Hoy
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => alert(`Próximamente: Ver detalles de ${client.name}`)}
                          className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert("Próximamente: Más opciones")}
                          className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 shadow-sm"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-500">Mostrando {filteredClients.length} clientes</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors bg-white dark:bg-slate-950">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
