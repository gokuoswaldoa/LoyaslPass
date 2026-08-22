"use client";

import { useState, useEffect } from "react";
import { getStaff, createStaff, deleteStaff } from "@/app/actions/staff";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Users, Plus, Trash2, QrCode, AlertTriangle } from "lucide-react";
import QRCode from "react-qr-code";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function StaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add Staff Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Show QR Modal
  const [showQRFor, setShowQRFor] = useState<{name: string, token: string} | null>(null);

  // Delete Confirm Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newStaff = await createStaff(newStaffName);
      setStaffList([newStaff, ...staffList]);
      setIsAddOpen(false);
      setNewStaffName("");
      // Immediately show QR
      setShowQRFor({ name: newStaff.name, token: newStaff.loginToken as string });
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
      setStaffList(staffList.filter(s => s.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getQRUrl = (token: string) => {
    if (typeof window === 'undefined') return "";
    return `${window.location.origin}/staff/join?token=${token}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-emerald-500" /> Empleados
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Crea cuentas de acceso rápido para que tu equipo pueda escanear tarjetas sin compartir contraseñas.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto">
          <Plus size={18} className="mr-2" /> Nuevo Empleado
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 border-none h-40" />
          ))}
        </div>
      ) : staffList.length === 0 ? (
        <Card className="text-center py-16 bg-white dark:bg-slate-900 border-dashed border-2 border-slate-200 dark:border-slate-800">
          <CardContent>
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Aún no tienes empleados</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Registra a tus meseros, cajeros o staff. Ellos escanearán un código QR especial para entrar a la app y dar sellos a nombre de tu negocio.
            </p>
            <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
              <Plus size={18} className="mr-2" /> Crear el Primero
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((staff) => (
            <Card key={staff.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                    {staff.name.substring(0, 2)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setDeleteId(staff.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">{staff.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Agregado el {format(new Date(staff.addedAt), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowQRFor({ name: staff.name, token: staff.loginToken })}
                >
                  <QrCode size={16} className="mr-2" /> Mostrar QR de Acceso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Asigna un nombre para identificarlo. Al guardar, se generará un Código QR.
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

      {/* Show QR Modal */}
      <Dialog open={!!showQRFor} onOpenChange={() => setShowQRFor(null)}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-slate-900 text-center flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center">Acceso para {showQRFor?.name}</DialogTitle>
            <DialogDescription className="text-center">
              Pide a tu empleado que escanee este código con la cámara de su celular para iniciar sesión automáticamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white p-4 rounded-xl inline-block shadow-sm border mt-4 mb-2">
            {showQRFor && (
              <QRCode 
                value={getQRUrl(showQRFor.token)}
                size={220}
                level="H"
              />
            )}
          </div>
          <p className="text-xs text-slate-500 max-w-[250px] mx-auto mt-2">
            Importante: Si el empleado renuncia, asegúrate de eliminarlo para invalidar este acceso.
          </p>
          
          <DialogFooter className="sm:justify-center mt-6 w-full">
            <Button onClick={() => setShowQRFor(null)} className="w-full">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={20} /> Revocar Acceso
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar a este empleado? Su código QR dejará de funcionar inmediatamente y su sesión se cerrará.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sí, Revocar Acceso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
