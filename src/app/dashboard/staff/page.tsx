"use client";

import { useState, useEffect } from "react";
import { getStaff, createStaff, deleteStaff, regenerateStaffToken, getStaffAnalytics } from "@/app/actions/staff";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Users, Plus, Trash2, QrCode, AlertTriangle, Activity, RefreshCw, Clock, Trophy, UserMinus, CheckCircle2 } from "lucide-react";
import QRCode from "react-qr-code";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type StaffType = {
  id: string;
  name: string;
  loginToken: string | null;
  addedAt: Date | null;
  isActive: boolean | null;
};

type AnalyticsType = {
  performance: { id: string; name: string; isActive: boolean | null; totalStamps: number; recentStamps: any[] }[];
  churnRisk: { customerId: string; customerName: string; lastSeen: Date; lastStaffId: string; lastStaffName: string }[];
  recentActivity: { id: string; stampedAt: Date | null; customerName: string; staffName: string }[];
};

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<"gestion" | "analiticas">("gestion");
  const [staffList, setStaffList] = useState<StaffType[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showQRFor, setShowQRFor] = useState<{ name: string; token: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [regenerateId, setRegenerateId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const staffRes = await getStaff();
      setStaffList(staffRes as StaffType[]);
      
      const metrics = await getStaffAnalytics();
      if (metrics.success) {
        setAnalytics(metrics as AnalyticsType);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newStaff = await createStaff(newStaffName);
      setStaffList([newStaff as StaffType, ...staffList]);
      setIsAddOpen(false);
      setNewStaffName("");
      setShowQRFor({ name: newStaff.name, token: newStaff.loginToken as string });
      loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStaff(deleteId);
      setStaffList(staffList.map(s => s.id === deleteId ? { ...s, isActive: false, loginToken: null } : s));
      setDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegenerate = async () => {
    if (!regenerateId) return;
    try {
      setIsSubmitting(true);
      const res = await regenerateStaffToken(regenerateId);
      if (res.success) {
        setStaffList(staffList.map(s => s.id === regenerateId ? { ...s, loginToken: res.token, isActive: true } : s));
        const staffName = staffList.find(s => s.id === regenerateId)?.name || "Empleado";
        setRegenerateId(null);
        setShowQRFor({ name: staffName, token: res.token as string });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQRUrl = (token: string) => {
    if (typeof window === 'undefined') return "";
    return `${window.location.origin}/staff/join`;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-emerald-500" /> Mi Equipo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Administra los accesos de tu equipo y analiza su desempeno.
          </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("gestion")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "gestion" ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Gestion
          </button>
          <button 
            onClick={() => setActiveTab("analiticas")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === "analiticas" ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Activity size={16} /> Analiticas
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <RefreshCw className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : activeTab === "gestion" ? (
        
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end">
            <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto">
              <Plus size={18} className="mr-2" /> Nuevo Empleado
            </Button>
          </div>

          {staffList.length === 0 ? (
            <Card className="text-center py-16 bg-white dark:bg-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-800">
              <CardContent>
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Aun no tienes empleados</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Registra a tus meseros o cajeros. Ellos escanearan un QR especial para entrar a la app y dar sellos a nombre de tu negocio.
                </p>
                <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus size={18} className="mr-2" /> Crear el Primero
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((staff) => (
                <Card key={staff.id} className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-shadow ${!staff.isActive ? 'opacity-60 grayscale' : 'hover:shadow-lg'}`}>
                  <CardContent className="p-6 relative">
                    {!staff.isActive && (
                      <div className="absolute top-4 right-4 bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">
                        Inactivo
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl uppercase ${staff.isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                        {staff.name.substring(0, 2)}
                      </div>
                      
                      {staff.isActive && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => setDeleteId(staff.id)}
                          title="Revocar acceso"
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                    
                    <h3 className={`text-lg font-bold truncate mb-1 ${staff.isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 line-through'}`}>
                      {staff.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      Agregado el {format(new Date(staff.addedAt!), "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                    
                    {staff.isActive ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowQRFor({ name: staff.name, token: staff.loginToken! })}
                        >
                          <QrCode size={16} className="mr-2" /> Ver QR
                        </Button>
                        <Button 
                          variant="outline"
                          className="px-3"
                          onClick={() => setRegenerateId(staff.id)}
                          title="Regenerar Token / Codigo"
                        >
                          <RefreshCw size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" className="w-full" disabled>
                        Acceso Revocado
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="text-amber-500" size={20} /> Empleados Destacados
                </CardTitle>
                <CardDescription>Rendimiento historico de tu personal.</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.performance.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay datos aun.</p>
                ) : (
                  <div className="space-y-4">
                    {analytics?.performance.sort((a,b) => b.totalStamps - a.totalStamps).slice(0, 5).map((staff, i) => (
                      <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                            #{i + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {staff.name} {!staff.isActive && <span className="text-xs font-normal text-slate-400">(Inactivo)</span>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{staff.totalStamps}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase">Sellos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserMinus className="text-red-500" size={20} /> Clientes en Riesgo
                </CardTitle>
                <CardDescription>Clientes inactivos (+60 dias) y quien los atendio.</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.churnRisk.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-emerald-500 font-medium">Excelente! No tienes clientes inactivos.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics?.churnRisk.slice(0, 5).map((risk, i) => (
                      <div key={i} className="flex flex-col p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{risk.customerName}</p>
                          <span className="text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-2 py-0.5 rounded">
                            {format(new Date(risk.lastSeen), "d MMM", { locale: es })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Ultimo sello por: <span className="font-medium text-slate-700 dark:text-slate-300">{risk.lastStaffName}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-blue-500" size={20} /> Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.recentActivity.length === 0 ? (
                <p className="text-sm text-slate-500">No hay sellos registrados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Fecha</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3 rounded-tr-lg rounded-br-lg">Atendido por</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.recentActivity.map((log) => (
                        <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {log.stampedAt ? format(new Date(log.stampedAt), "d MMM, h:mm a", { locale: es }) : "N/A"}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                            {log.customerName}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-medium">
                              {log.staffName}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Asigna un nombre. Al guardar, se generara un Codigo QR.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStaff} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre o Identificador</label>
              <Input 
                placeholder="Ej. Carlos - Barbero 1" 
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting || !newStaffName.trim()} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                {isSubmitting ? "Creando..." : "Crear y Generar QR"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showQRFor} onOpenChange={() => setShowQRFor(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 overflow-hidden p-0 border-0">
          <div className="bg-emerald-500 p-6 text-white text-center rounded-t-lg relative">
            <h2 className="text-2xl font-black mb-1">Acceso para {showQRFor?.name}</h2>
            <p className="text-emerald-100 text-sm font-medium">Sigue estas instrucciones con tu empleado.</p>
          </div>
          
          <div className="p-6 space-y-6">
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">1</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Escanear el código</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Pídele a tu empleado que abra su cámara y escanee este código. Esto abrirá la página en su celular.</p>
                <div className="bg-white p-3 rounded-xl inline-block border shadow-sm mx-auto">
                  {showQRFor && (
                    <QRCode 
                      value={getQRUrl("")} 
                      size={140}
                      level="H"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Instalar la App</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pídele que presione <strong>Compartir</strong> y luego <strong>Agregar a inicio</strong> para instalar el escáner en su pantalla y ocultar el navegador.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">3</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Ingresar el PIN</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Díctale el siguiente código de acceso para que inicie sesión en su nueva App.</p>
                {showQRFor && (
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                    <p className="text-3xl font-black tracking-[0.2em] text-slate-900 dark:text-white">{showQRFor.token}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-emerald-500 text-white rounded-full p-1"><CheckCircle2 size={16} /></div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">¡Listo! Tu empleado ya puede otorgar sellos.</p>
            </div>

          </div>
          
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
            <Button onClick={() => setShowQRFor(null)} className="w-full sm:w-auto">
              Entendido, cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!regenerateId} onOpenChange={() => setRegenerateId(null)}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-500">
              <RefreshCw size={20} /> Regenerar QR
            </DialogTitle>
            <DialogDescription>
              Deseas generar un nuevo acceso? El celular anterior perdera la sesion, pero el historial se mantendra.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setRegenerateId(null)}>Cancelar</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleRegenerate} disabled={isSubmitting}>
              Si, Regenerar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={20} /> Revocar Acceso
            </DialogTitle>
            <DialogDescription>
              El empleado perdera el acceso inmediatamente. **Su historial de sellos se conservara para tus analiticas.**
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>
              Si, Revocar Acceso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
