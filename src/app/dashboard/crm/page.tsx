"use client";

import { Search, Filter, MoreVertical, Star, History, ArrowUpRight, X, Trash2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getCustomers, deleteCustomer, addManualStamp } from "@/app/actions/dashboard";
import Image from "next/image";
import Link from "next/link";

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
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
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

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.phone && c.phone.includes(searchQuery));
    if (!matchesSearch) return false;
    
    if (filterStatus === "Todos") return true;
    return c.status === filterStatus;
  });

  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = async (action: 'delete' | 'stamp') => {
    if (!selectedClient) return;
    setActionLoading(true);
    
    if (action === 'delete') {
      const res = await deleteCustomer(selectedClient.id);
      if (res.success) {
        setClients(clients.filter(c => c.id !== selectedClient.id));
        setDeleteModalOpen(false);
      } else {
        alert(res.error || "Error al eliminar");
      }
    } else if (action === 'stamp') {
      const res = await addManualStamp(selectedClient.id);
      if (res.success) {
        setClients(clients.map(c => {
          if (c.id === selectedClient.id) {
            const newStamps = c.stamps + 1;
            return {
              ...c,
              stamps: newStamps,
              status: newStamps >= (c.totalStampsRequired || 8) ? 'VIP' : 'Activo'
            };
          }
          return c;
        }));
      } else {
        alert(res.error || "Error al dar sello");
      }
    }
    
    setActionLoading(false);
    setActionsModalOpen(false);
  };

  const exportToCSV = () => {
    if (filteredClients.length === 0) {
      alert("No hay clientes para exportar.");
      return;
    }

    const headers = ["Nombre,Teléfono,Sellos,Estado,PuntosRequeridos\n"];
    const rows = filteredClients.map(c => 
      `${c.name},${c.phone || "Sin teléfono"},${c.stamps},${c.status},${c.totalStampsRequired || 8}\n`
    );

    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clientes_loyalpass.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


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
          <button 
            onClick={exportToCSV}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
          >
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
            <button 
              onClick={() => setFilterStatus("Todos")}
              className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl font-bold transition-colors whitespace-nowrap ${filterStatus === 'Todos' ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500'}`}
            >
              <Filter className="w-4 h-4" /> Todos
            </button>
            <button 
              onClick={() => setFilterStatus("VIP")}
              className={`px-4 py-3 border-2 rounded-xl font-bold transition-colors whitespace-nowrap ${filterStatus === 'VIP' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500'}`}
            >
              VIP
            </button>
            <button 
              onClick={() => setFilterStatus("Riesgo")}
              className={`px-4 py-3 border-2 rounded-xl font-bold transition-colors whitespace-nowrap ${filterStatus === 'Riesgo' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500'}`}
            >
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
                      <div className="flex justify-end gap-2 relative">
                        <button 
                          onClick={() => { setSelectedClient(client); setDetailsModalOpen(true); }}
                          className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-colors"
                          title="Ver Detalles"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => { 
                            setSelectedClient(client);
                            setActionsModalOpen(true);
                          }}
                          className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 shadow-sm transition-colors"
                          title="Opciones"
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

      {/* MODAL DETALLES */}
      {detailsModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-slate-200 dark:border-slate-700">
            <button onClick={() => setDetailsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center font-bold text-3xl text-emerald-600 dark:text-emerald-400 border-4 border-white dark:border-slate-800 shadow-sm mb-4">
                {selectedClient.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center">{selectedClient.name}</h3>
              <p className="text-slate-500 font-medium">{selectedClient.phone || "Sin teléfono"}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Progreso</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedClient.stamps} / {selectedClient.totalStampsRequired} Sellos</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (selectedClient.stamps / (selectedClient.totalStampsRequired || 8)) * 100)}%` }}></div>
              </div>
            </div>

            {selectedClient.walletPassId && (
              <a 
                href={`/${window.location.hostname.includes('localhost') ? 'demo' : ''}/pass/${selectedClient.walletPassId}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Abrir Tarjeta Web <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deleteModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">¿Eliminar Cliente?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
              Estás a punto de eliminar a <strong>{selectedClient.name}</strong>. Esta acción borrará todos sus sellos y no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                disabled={actionLoading}
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleAction('delete')}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center"
                disabled={actionLoading}
              >
                {actionLoading ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ACCIONES */}
      {actionsModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative border border-slate-200 dark:border-slate-700">
            <button onClick={() => setActionsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acciones Rápidas</h3>
            <p className="text-sm text-slate-500 mb-6">Gestionar a <strong>{selectedClient.name}</strong></p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleAction('stamp')}
                disabled={actionLoading}
                className="w-full flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Star className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-slate-900 dark:text-white text-sm">Dar Sello Manual</span>
                  <span className="block text-xs text-slate-500 font-medium">Sumará +1 sello inmediatamente</span>
                </div>
              </button>

              <button 
                onClick={() => { setActionsModalOpen(false); setDeleteModalOpen(true); }}
                disabled={actionLoading}
                className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-900/30"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-red-600 dark:text-red-400 text-sm">Eliminar Cliente</span>
                  <span className="block text-xs text-red-500 font-medium">Borrar historial permanentemente</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
