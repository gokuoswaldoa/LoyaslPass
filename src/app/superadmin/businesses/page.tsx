import { db } from "@/db";
import { businesses } from "@/db/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActionsMenu } from "./actions-menu";
import { MessageCircle } from "lucide-react";

export default async function BusinessesPage() {
  const allBusinesses = await db.select().from(businesses).orderBy(businesses.createdAt);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Gestión de Negocios</h2>
        <p className="text-slate-500 mt-2">Administra pruebas gratuitas, mensualidades y suspensiones.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead>Negocio</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBusinesses.map((b) => {
                let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
                let statusLabel = b.status;
                
                if (b.status === "trial") {
                  badgeVariant = "secondary";
                  statusLabel = "En Prueba";
                } else if (b.status === "active") {
                  badgeVariant = "default";
                  statusLabel = "Activo";
                } else if (b.status === "suspended") {
                  badgeVariant = "destructive";
                  statusLabel = "Suspendido";
                }

                const endAt = b.status === "active" ? b.subscriptionEndsAt : b.trialEndsAt;
                const isExpired = endAt && new Date(endAt) < new Date();

                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="font-bold text-slate-900 dark:text-white">{b.name}</p>
                      <p className="text-xs text-slate-500">ID: {b.id.substring(0,8)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{b.email}</p>
                      {b.whatsapp ? (
                        <a href={`https://wa.me/${b.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-emerald-600 hover:underline mt-1">
                          <MessageCircle size={12} /> {b.whatsapp}
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 mt-1 block">Sin WhatsApp</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant as "default" | "secondary" | "destructive" | "outline"} className={isExpired ? "opacity-50" : ""}>
                        {statusLabel}
                      </Badge>
                      {isExpired && <Badge variant="destructive" className="ml-2 text-[10px]">Expirado</Badge>}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {endAt ? format(new Date(endAt), "dd MMM yyyy", { locale: es }) : "N/A"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionsMenu businessId={b.id} currentStatus={b.status || "trial"} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
