"use client";

import { useState, useEffect } from "react";
import { getStaffList, addStaffMember, removeStaffMember } from "@/app/actions/settings";
import { Users, Plus, Trash2, Mail, ShieldAlert } from "lucide-react";

type StaffMember = {
  id: string;
  email: string;
  addedAt: Date | null;
};

export default function SettingsPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    const res = await getStaffList();
    if (res.success && res.staffList) {
      setStaff(res.staffList);
    }
    setLoading(false);
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newEmail) return;

    setIsSubmitting(true);
    const res = await addStaffMember(newEmail);
    if (res.success) {
      setNewEmail("");
      await loadStaff();
    } else {
      setError(res.error || "Error al agregar empleado");
    }
    setIsSubmitting(false);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar a este empleado? Ya no podrá escanear códigos.")) return;
    
    const res = await removeStaffMember(id);
    if (res.success) {
      await loadStaff();
    }
  };

  return (
    <div className="p-6 md:p-10 pb-32 w-full max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Configuración
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">
          Administra el acceso de tus empleados y ajustes de la cuenta.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Empleados (Staff)</h2>
            <p className="text-slate-500 text-sm font-medium">Autoriza quién puede dar sellos en tu negocio.</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4 flex gap-3 mb-8">
          <ShieldAlert className="text-blue-500 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Los empleados que agregues aquí podrán iniciar sesión con su cuenta de Google. 
            <strong> Solo tendrán acceso al escáner de códigos QR.</strong> No podrán ver tus estadísticas ni modificar tu tarjeta.
          </p>
        </div>

        <form onSubmit={handleAddStaff} className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="correo@gmail.com" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Agregando..." : <><Plus size={20} /> Agregar Empleado</>}
          </button>
        </form>

        {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-widest text-slate-400">
                <th className="p-4 font-bold">Correo Electrónico</th>
                <th className="p-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-slate-500 font-bold">Cargando empleados...</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-slate-500 font-medium">No has agregado a ningún empleado aún.</td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                          {member.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{member.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleRemove(member.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar empleado"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
