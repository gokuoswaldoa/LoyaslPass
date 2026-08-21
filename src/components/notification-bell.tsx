"use client";

import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Polling cada minuto
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/notifications", { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    if (newState) {
      markAsRead();
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        ref={buttonRef}
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm shadow-rose-500/50"></span>
        )}
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 focus:outline-none z-50 border border-slate-200/50 dark:border-white/10 overflow-hidden"
          >
            <div className="px-5 py-4 font-black text-slate-800 dark:text-slate-200 border-b border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center bg-white/40 dark:bg-slate-900/40">
              Notificaciones
              {unreadCount > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                  {unreadCount} Nuevas
                </span>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto p-0">
              {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <Bell className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">No tienes notificaciones</p>
                  <p className="text-xs text-slate-400 mt-1">Aquí recibirás alertas de tu cuenta.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-5 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors ${!notif.isRead ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}>
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2">
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          )}
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{notif.title}</h4>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-3">
                          {format(new Date(notif.createdAt), "d MMM, HH:mm", { locale: es })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
