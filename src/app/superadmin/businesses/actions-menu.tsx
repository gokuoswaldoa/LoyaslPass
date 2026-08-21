"use client";

import { useState } from "react";
import { extendTrial, activateSubscription, suspendAccount } from "@/app/actions/superadmin";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlayCircle, Clock, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ActionsMenu({ businessId, currentStatus }: { businessId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: () => Promise<any>) => {
    if (loading) return;
    setLoading(true);
    await action();
    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md" disabled={loading}>
        <span className="sr-only">Abrir menú</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleAction(() => activateSubscription(businessId))} className="text-emerald-600 dark:text-emerald-400">
          <PlayCircle className="mr-2 h-4 w-4" /> Activar Mensualidad
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleAction(() => extendTrial(businessId, 15))}>
          <Clock className="mr-2 h-4 w-4" /> Extender Prueba 15d
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {currentStatus !== "suspended" && (
          <DropdownMenuItem onClick={() => handleAction(() => suspendAccount(businessId))} className="text-red-600 dark:text-red-400">
            <Ban className="mr-2 h-4 w-4" /> Suspender
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
