"use client";

import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-200 dark:border-slate-800">
          <div className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800">
            Notificaciones
          </div>
          <div className="max-h-96 overflow-y-auto p-0">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No tienes notificaciones
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {format(new Date(notif.createdAt), "d MMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
