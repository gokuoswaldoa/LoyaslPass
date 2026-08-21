import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, ArrowLeft } from "lucide-react";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Verificar rol
  const userArray = await db.select().from(users).where(eq(users.id, session.user.id));
  const dbUser = userArray[0];

  const isSuperAdminEmail = session.user.email === process.env.SUPER_ADMIN_EMAIL;
  const hasSuperAdminRole = dbUser?.role === "superadmin";

  if (!isSuperAdminEmail && !hasSuperAdminRole) {
    redirect("/dashboard");
  }

  // Auto-upgrade if email matches but role isn't set
  if (isSuperAdminEmail && !hasSuperAdminRole) {
    await db.update(users).set({ role: "superadmin" }).where(eq(users.id, session.user.id));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-black text-purple-600 dark:text-purple-400">Super Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/superadmin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 font-medium">
            <LayoutDashboard size={20} /> Vista General
          </Link>
          <Link href="/superadmin/businesses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 font-medium">
            <Users size={20} /> Negocios
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 font-medium">
            <ArrowLeft size={20} /> Volver a mi Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
          <h1 className="font-black text-purple-600">Super Admin</h1>
          <Link href="/dashboard" className="text-sm font-medium text-slate-500">Volver</Link>
        </div>
        
        {children}
      </main>
    </div>
  );
}
