import { db } from "@/db";
import { businesses } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Clock, CheckCircle2, Ban } from "lucide-react";

export default async function SuperAdminPage() {
  const allBusinesses = await db.select().from(businesses);

  const total = allBusinesses.length;
  const trial = allBusinesses.filter(b => b.status === "trial").length;
  const active = allBusinesses.filter(b => b.status === "active").length;
  const suspended = allBusinesses.filter(b => b.status === "suspended").length;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Panel de Control</h2>
        <p className="text-slate-500 mt-2">Métricas globales de LoyalPass</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Negocios</CardTitle>
            <Store className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">En Prueba (Trial)</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{trial}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Activos (Pagados)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Suspendidos</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{suspended}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
