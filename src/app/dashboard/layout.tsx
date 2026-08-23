"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, Megaphone, Settings, LogOut, ScanLine, Menu, X, WalletCards, CheckCircle2, IdCard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scanner } from "@/components/scanner";
import { verifyClientQR, addStampToClient, getFrequentCustomers, searchCustomers } from "@/app/actions/scanner";
import { getUserRoleInfo } from "@/app/actions/settings";
import { logoutStaff } from "@/app/actions/staff";
import { Search, Star } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnboardingTour } from "@/components/onboarding-tour";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCustomer, setScannedCustomer] = useState<{ id: string, name: string, stampsCount: number } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stampSuccess, setStampSuccess] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [frequentCustomers, setFrequentCustomers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [userRole, setUserRole] = useState<"owner" | "staff" | "loading">("loading");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [lockScreen, setLockScreen] = useState<"none" | "trial_expired" | "subscription_expired" | "suspended">("none");

  useEffect(() => {
    async function checkRole() {
      if (status === "loading") return;
      
      const res = await getUserRoleInfo();
      if (res.success && res.role) {
        setUserRole(res.role as "owner" | "staff");
        if (res.superadmin) setIsSuperAdmin(true);

        // LÃ³gica de expiraciÃ³n (solo para owners)
        if (res.role === "owner") {
          const now = new Date();
          if (res.businessStatus === "suspended") {
            setLockScreen("suspended");
          } else if (res.businessStatus === "trial" && res.trialEndsAt && new Date(res.trialEndsAt) < now) {
            setLockScreen("trial_expired");
          } else if (res.businessStatus === "active" && res.subscriptionEndsAt && new Date(res.subscriptionEndsAt) < now) {
            setLockScreen("subscription_expired");
          }
        }

      } else {
        if (status === "authenticated") {
          // If no role, might just be starting onboarding, but let's default to owner for the layout until onboarding finishes
          setUserRole("owner");
        } else {
          // Not authenticated at all, redirect to home
          window.location.href = "/";
        }
      }
    }
    checkRole();
  }, [status]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (userRole === "staff") {
      await logoutStaff();
      window.location.href = "/";
    } else {
      signOut({ callbackUrl: "/" });
    }
  };

  // Load frequent customers when scanner opens
  useEffect(() => {
    if (showScanner) {
      loadFrequent();
    }
  }, [showScanner]);

  async function loadFrequent() {
    const res = await getFrequentCustomers();
    if (res.success && res.customers) {
      setFrequentCustomers(res.customers);
    }
  }

  // Handle Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const res = await searchCustomers(searchQuery);
        if (res.success && res.customers) {
          setSearchResults(res.customers);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (status === "loading" || userRole === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const handleScanSuccess = async (qrData: string) => {
    setIsProcessing(true);
    setScanError(null);
    try {
      const res = await verifyClientQR(qrData);
      if (res.success && res.customer) {
        setScannedCustomer(res.customer);
      } else {
        setScanError(res.error || "CÃ³digo no vÃ¡lido.");
      }
    } catch (e) {
      setScanError("Error de conexiÃ³n.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddStamp = async () => {
    if (!scannedCustomer) return;
    setIsProcessing(true);
    try {
      const res = await addStampToClient(scannedCustomer.id);
      if (res.success) {
        setStampSuccess(true);
        setTimeout(() => {
          setShowScanner(false);
          setScannedCustomer(null);
          setStampSuccess(false);
        }, 2000);
      } else {
        setScanError(res.error || "Error al agregar sello.");
      }
    } catch (e) {
      setScanError("Error de conexiÃ³n.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScannedCustomer(null);
    setScanError(null);
    setStampSuccess(false);
    setSearchQuery("");
  };

  const navItems = [
    { label: "Vista General", href: "/dashboard", icon: LayoutDashboard, id: "tour-vista-general" },
    { label: "Clientes (CRM)", href: "/dashboard/crm", icon: Users, id: "tour-clientes" },
    { label: "Marketing", href: "/dashboard/marketing", icon: Megaphone, id: "tour-marketing" },
    { label: "DiseÃ±o de Tarjeta", href: "/dashboard/editor", icon: WalletCards, id: "tour-diseno" },
    { label: "Empleados", href: "/dashboard/staff", icon: IdCard, id: "tour-empleados" },
    { label: "ConfiguraciÃ³n", href: "/dashboard/settings", icon: Settings, id: "tour-configuracion" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {userRole === "owner" && (
        <OnboardingTour setMobileMenuOpen={setMobileMenuOpen} setIsTourRunning={setIsTourRunning} />
      )}
      
      {/* --- MOBILE TOPBAR --- */}
      <div className={`md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 ${mobileMenuOpen ? 'hidden' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-40 h-10 relative flex items-center justify-start">
            <Image src="/logo/color%20definitivo%20con%20titutlo.svg" alt="LoyalPass" fill className="object-contain object-left" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {userRole === "owner" && (
            <>
              <NotificationBell />
              <button 
                id="tour-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- SIDEBAR (Desktop) & MOBILE MENU --- */}
      <AnimatePresence>
        {userRole === "owner" && (mobileMenuOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.aside 
            initial={{ x: isTourRunning ? 0 : -300, opacity: isTourRunning ? 1 : 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isTourRunning ? 0 : -300, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: isTourRunning ? 0 : 0.4 }}
            className={`
              fixed md:sticky top-0 left-0 z-30
              w-[280px] h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
              flex flex-col
              ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              ${isTourRunning ? "transition-none" : "transition-transform duration-300 ease-in-out md:transition-none"}
            `}
          >
            {/* Logo Area */}
            <div className="hidden md:flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/50">
              <div className="h-12 relative w-40 flex items-center justify-start">
                <Image src="/logo/color%20definitivo%20con%20titutlo.svg" alt="LoyalPass" fill className="object-contain object-left" />
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <NotificationBell />
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate">{session?.user?.name || "Usuario"}</p>
                  <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pb-6 space-y-1.5 overflow-y-auto">
              <p className="px-4 text-xs font-black uppercase tracking-widest text-slate-400 mb-3 mt-2">MenÃº Principal</p>
              {lockScreen === "none" && navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    id={item.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                      isActive 
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <item.icon size={20} className={isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"} />
                    {item.label}
                  </Link>
                );
              })}
              
              {isSuperAdmin && (
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link 
                    href="/superadmin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold transition-all hover:bg-purple-100 dark:hover:bg-purple-500/20"
                  >
                    <Star size={20} className="text-purple-600 dark:text-purple-400" />
                    Panel Super Admin
                  </Link>
                </div>
              )}
            </nav>

            {/* Logout */}
            <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800/50">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors font-semibold"
              >
                <LogOut size={20} />
                Cerrar SesiÃ³n
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 relative pb-24 md:pb-0 min-h-screen">
        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {userRole === "staff" ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center mt-20 md:mt-40">
            <ScanLine className="w-24 h-24 text-slate-300 dark:text-slate-700 mb-6" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Modo EscÃ¡ner</h1>
            <p className="text-slate-500 text-lg max-w-sm mb-10">Has iniciado sesiÃ³n como Empleado. Usa el botÃ³n inferior para dar sellos a los clientes.</p>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <LogOut size={20} /> Salir
            </button>
          </div>
        ) : lockScreen === "trial_expired" ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center mt-20 md:mt-40">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
              <LogOut size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Tu prueba ha finalizado</h1>
            <p className="text-slate-500 text-lg max-w-md mb-10">
              Si decides continuar con nuestros servicios para impulsar tus ventas, por favor contacta a Oswaldo directamente vÃ­a telefÃ³nica para activar tu plan.
            </p>
            <a href="https://wa.me/5211234567890" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors">
              Contactar por WhatsApp
            </a>
          </div>
        ) : lockScreen === "subscription_expired" ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center mt-20 md:mt-40">
            <div className="w-24 h-24 bg-amber-100 dark:bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6">
              <LogOut size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Mensualidad terminada</h1>
            <p className="text-slate-500 text-lg max-w-md mb-10">
              Â¿Quieres renovar tu plan? Contacta a soporte para reactivar tu cuenta inmediatamente y seguir premiando a tus clientes.
            </p>
            <a href="https://wa.me/5211234567890" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors">
              Renovar Plan
            </a>
          </div>
        ) : lockScreen === "suspended" ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center mt-20 md:mt-40">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-6">
              <LogOut size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Cuenta Suspendida</h1>
            <p className="text-slate-500 text-lg max-w-md mb-10">
              Tu cuenta ha sido suspendida por falta de pago o incumplimiento de tÃ©rminos. Por favor contacta a soporte para mÃ¡s detalles.
            </p>
          </div>
        ) : (
          children
        )}
      </main>

      {/* --- FLOATING ACTION BUTTON (SCANNER) --- */}
      {lockScreen === "none" && (
        <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50">
          <button
            onClick={() => {
              resetScanner();
              setShowScanner(true);
            }}
            className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-600 text-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-emerald-500/40 hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] border-2 border-white/20"></div>
            <ScanLine className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
            
            {/* Ping effect */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* --- SCANNER MODAL (SIMULATED) --- */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-black text-xl">Escanear Cliente</h3>
                <button 
                  onClick={() => setShowScanner(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                {!scannedCustomer ? (
                  <>
                    <Scanner onScanSuccess={handleScanSuccess} isProcessing={isProcessing} />
                    {scanError && (
                      <p className="mt-4 text-center text-red-500 font-bold">{scanError}</p>
                    )}
                    
                    <div className="w-full mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 font-semibold">o buscar cliente</span>
                        </div>
                      </div>
                      
                      <div className="relative mt-6">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Search size={18} className="text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Nombre o TelÃ©fono" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      {/* Search Results or Frequent Customers */}
                      <div className="mt-4 max-h-48 overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                        {searchQuery.trim().length >= 2 ? (
                          isSearching ? (
                            <p className="p-4 text-center text-slate-500 text-sm font-medium">Buscando...</p>
                          ) : searchResults.length > 0 ? (
                            searchResults.map(c => (
                              <div key={c.id} onClick={() => setScannedCustomer(c)} className="p-3 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</p>
                                  <p className="text-xs text-slate-500">{c.phone || "Sin telÃ©fono"}</p>
                                </div>
                                <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded text-xs font-bold">
                                  {c.stampsCount} sellos
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="p-4 text-center text-slate-500 text-sm font-medium">No se encontraron clientes.</p>
                          )
                        ) : frequentCustomers.length > 0 ? (
                          <>
                            <div className="p-2 bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                              <Star size={14} className="text-amber-500" />
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clientes Frecuentes</span>
                            </div>
                            {frequentCustomers.map(c => (
                              <div key={c.id} onClick={() => setScannedCustomer(c)} className="p-3 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</p>
                                  <p className="text-xs text-slate-500">{c.phone || "Sin telÃ©fono"}</p>
                                </div>
                                <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded text-xs font-bold">
                                  {c.stampsCount} sellos
                                </div>
                              </div>
                            ))}
                          </>
                        ) : null}
                      </div>

                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    {stampSuccess ? (
                      <div className="flex flex-col items-center py-8">
                        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4 animate-bounce" />
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Â¡Sello Agregado!</h2>
                        <p className="text-slate-500 mt-2">El cliente ha sido notificado.</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-3xl font-black mb-4">
                          {scannedCustomer.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{scannedCustomer.name}</h2>
                        <p className="text-slate-500 font-medium mb-8">
                          Actualmente tiene <strong className="text-emerald-500 text-lg">{scannedCustomer.stampsCount}</strong> sellos
                        </p>

                        {scanError && (
                          <p className="mb-4 text-center text-red-500 font-bold">{scanError}</p>
                        )}

                        <button 
                          onClick={handleAddStamp}
                          disabled={isProcessing}
                          className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                        >
                          {isProcessing ? "Procesando..." : "Otorgar 1 Sello"}
                        </button>
                        
                        <button 
                          onClick={resetScanner}
                          className="w-full mt-3 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          Cancelar y Volver
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

