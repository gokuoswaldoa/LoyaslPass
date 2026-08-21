"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: any) => !n.isRead).length);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/notifications", { method: "POST" });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Popover onOpenChange={(open) => { if (open) markAsRead(); }}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-sm">Notificaciones del Sistema</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Cargando...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <Bell className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500 font-medium">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{n.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: es })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
