"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Gift, Users, Crown, Zap, Plus, CalendarDays, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import CoffeeIcon from "@/components/ui/coffee-icon";

// Emil Kowalski spring preset
const springConfig = { type: "spring" as const, stiffness: 400, damping: 30 };

// Reusable FAQ Item Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={springConfig}
          className="text-gray-400 group-hover:text-emerald-500"
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

export default function LandingPage() {
  const { status } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100">

      {/* 1. NAVBAR (Sticky & Glassmorphism) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-12 md:h-16 relative w-48 md:w-64 flex items-center justify-start transform group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo/color%20definitivo%20con%20titutlo.svg" alt="LoyalPass" fill className="object-contain object-left" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#como-funciona" className="text-sm font-medium text-slate-600 hover:text-emerald-500 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors">Cómo funciona</Link>
            <Link href="#precios" className="text-sm font-medium text-slate-600 hover:text-emerald-500 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors">Precios</Link>
            <Link href="#faq" className="text-sm font-medium text-slate-600 hover:text-emerald-500 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors">FAQ</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-semibold text-slate-900 hover:text-emerald-500 dark:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/onboarding" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white transition-colors shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20">
              Empezar gratis
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 dark:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/10 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                <Link href="#como-funciona" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">Cómo funciona</Link>
                <Link href="#precios" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">Precios</Link>
                <Link href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">FAQ</Link>
                <div className="h-px bg-slate-200 dark:bg-white/10 w-full my-2"></div>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-slate-900 dark:text-white">
                  Iniciar sesión
                </Link>
                <Link href="/onboarding" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-lg text-sm font-bold w-full">
                  Empezar gratis
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-[80px] pb-16 lg:pt-[25px] lg:pb-20 relative overflow-hidden bg-white dark:bg-black">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-start max-w-7xl">

          {/* Texto Izquierda */}
          <div className="text-center lg:text-left pt-0 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springConfig}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-8 border border-emerald-100 dark:border-emerald-500/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              La Tarjeta de Lealtad Digital #1
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6"
            >
              Haz que tus clientes <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-300">vuelvan más seguido.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Crea tu tarjeta de lealtad en 30 segundos. Sin apps para descargar, vive directo en el Apple y Google Wallet de tus clientes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16 lg:mb-0"
            >
              <Link href="/onboarding" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-colors shadow-xl shadow-emerald-500/25 group">
                Crea tu primera tarjeta
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                14 días gratis. Cancela cuando quieras.
              </span>
            </motion.div>
          </div>

          {/* Hero Mockup (Floating Phone) Derecha */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.4 }}
            className="relative mx-auto lg:ml-auto w-full max-w-[340px] md:max-w-[380px] lg:max-w-[300px] aspect-[1/2]"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800"
            >
              <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 rounded-b-3xl w-32 mx-auto z-50"></div>
              <div className="w-full h-full bg-black rounded-[2.2rem] overflow-hidden relative flex flex-col items-center justify-center">
                {/* Fake Wallet Pass */}
                <div className="w-11/12 bg-gradient-to-b from-slate-600 to-slate-800 rounded-2xl p-6 shadow-2xl mb-12">
                  <div className="flex justify-between items-center mb-8">
                    <div className="font-bold text-white text-lg">Café Central</div>
                    <div className="w-15 h-15 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                      <Image src="/logo/cafe.webp" alt="Logo" width={60} height={60} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="aspect-square rounded-full bg-emerald-900/50 flex items-center justify-center">
                        <CoffeeIcon className="w-6 h-6 text-emerald-400" />
                      </div>
                    ))}
                    <div className="aspect-square rounded-full border-2 border-dashed border-emerald-400/40 flex items-center justify-center">
                      <CoffeeIcon className="w-6 h-6 text-emerald-400/30" />
                    </div>
                    <div className="aspect-square rounded-full border-2 border-dashed border-emerald-400/40 bg-emerald-900/20 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-emerald-400/50" />
                    </div>
                  </div>
                  <div className="text-center text-emerald-100 font-medium text-sm mt-4">
                    Faltan 2 sellos para tu café gratis
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* TRUST BANNER (GDPR) */}
      <section className="border-y border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 py-8 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 md:gap-x-16 items-center text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Cumplimiento GDPR
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Reglamento de la Unión Europea
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Conexión Cifrada
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              SSL / TLS en cada acceso
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMO FUNCIONA (Estilo AlmendroApp) */}
      <section id="como-funciona" className="py-24 bg-[#D3DFD1] dark:bg-emerald-950/20 relative">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#2F3E32] dark:text-white tracking-tight leading-tight">
              Funciona así de <br className="md:hidden" />
              <span className="relative inline-block mt-2 md:mt-0">
                <span className="relative z-10">simple.</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-emerald-400/40 -z-10 transform -rotate-1"></span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {[
              {
                num: "01",
                title: "Creas tu tarjeta al momento",
                desc: <><strong>Nombre, recompensa, tu logo.</strong> Listo. Sin diseñador, sin ayuda técnica.</>,
                image: "/imagenes-pasos/paso1.jpeg"
              },
              {
                num: "02",
                title: "Tu cliente la guarda con un QR",
                desc: <><strong>Un toque y queda en su wallet.</strong> Sin apps que descargar, sin registros largos.</>,
                image: "/imagenes-pasos/paso2.png"
              },
              {
                num: "03",
                title: "Le das sellos en segundos",
                desc: <><strong>Escaneas su tarjeta con tu cámara</strong> — o lo buscas por su nombre. Cada sello lo acerca a su premio y lo motiva a volver.</>,
                image: "/imagenes-pasos/paso3.png"
              },
              {
                num: "04",
                title: "Y una notificación lo hace volver",
                desc: <><strong>Le llega un mensaje a la pantalla del celular</strong> cuando pasa cerca de tu negocio o cuando tú quieras.</>,
                image: "/imagenes-pasos/paso4.png"
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{
                  delay: 0.1,
                  ...springConfig
                }}
                className="group flex flex-col md:flex-row items-center bg-[#F8F9F8] dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 gap-8 border border-white/50 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Imagen */}
                <div className="w-full md:w-5/12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-white/5 shadow-inner">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Contenido */}
                <div className="w-full md:w-7/12 flex flex-col justify-center py-4">
                  <span className="text-[#E76F51] dark:text-orange-400 font-bold text-lg mb-2 tracking-wider">{step.num}</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5. SECCION VISTA CLIENTE (Wallet) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden flex flex-col items-center border-y border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-6 max-w-5xl z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl md:leading-[1.1] font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Así se ve tu tarjeta <br />
              en el <span className="text-emerald-500 inline-block mt-2 md:mt-0">celular de tus</span> <br />
              <span className="text-emerald-500 inline-block mt-2 md:mt-1">clientes.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-3xl mx-auto mt-6">
              Tu logo, tus colores y tu recompensa. Se guarda en Apple Wallet y Google Wallet, sin apps.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center justify-center relative"
          >
            <Image 
              src="/material/pantalla-cliente.jpg" 
              alt="Vista de la tarjeta en el celular" 
              width={600} 
              height={800} 
              className="w-full max-w-md lg:max-w-xl object-cover rounded-[3rem] mb-8 z-10 relative shadow-2xl"
            />
            
            <div className="flex flex-row items-center justify-center gap-4 md:gap-6 z-10 relative">
              <Image src="/material/add-to-apple-wallet-logo.png" alt="Add to Apple Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />
              <Image src="/material/Add_to_Google_Wallet_badge.svg.webp" alt="Add to Google Wallet" width={160} height={50} className="h-10 md:h-12 w-auto cursor-pointer hover:scale-105 transition-transform" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3.6. SECCION NOTIFICACIONES */}
      <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-6 tracking-wide uppercase">
              Marketing Directo
            </div>
            <h2 className="text-5xl md:text-6xl md:leading-[1.1] font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Hazte notar con <br className="hidden md:block"/>
              <span className="text-emerald-500">alertas en su bolsillo.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Lanza ofertas exclusivas, novedades o ventas nocturnas.</strong> Llega directamente a la pantalla de bloqueo de tus clientes mediante notificaciones Push nativas. Olvídate de los emails que nadie lee o los algoritmos de redes sociales.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-12">
            
            {/* Tarjetas / Beneficios Izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-6 order-2 lg:order-1"
            >
              {/* Beneficio 1 */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xl">
                    90%
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Tasa de apertura superior</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Las notificaciones de Wallet son vistas casi de inmediato por tus clientes, superando masivamente el rendimiento de cualquier campaña tradicional por correo electrónico.
                </p>
              </div>

              {/* Beneficio 2 */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Envíos en segundos</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Redacta tu promoción desde nuestro panel de control interactivo y haz clic en enviar. Tus clientes recibirán la vibración y el mensaje en tiempo real.
                </p>
              </div>
            </motion.div>

            {/* Imagen Derecha */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex justify-center order-1 lg:order-2"
            >
              <Image 
                src="/material/notificacion.png" 
                alt="Notificación Push en pantalla de bloqueo" 
                width={500} 
                height={700} 
                className="w-full max-w-[300px] md:max-w-[360px] object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PRECIOS */}
      <section id="precios" className="py-24 bg-white dark:bg-black relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Planes simples y transparentes</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Pruébalo gratis por 14 días. Escala tu negocio con el plan que mejor se adapte a ti.</p>
            
            {/* GLOBAL BADGE */}
            <div className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium text-sm md:text-base border border-emerald-100 dark:border-emerald-800/50 shadow-sm text-center">
              <span>Todos nuestros planes incluyen: <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">Tarjetas digitales y Notificaciones push ilimitadas</strong> sin costo extra.</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto py-8">

            {/* PLAN BÁSICO */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Básico</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">Para arrancar tu primer programa de fidelidad.</p>

              <div className="mb-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$399</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <div className="text-sm text-slate-500 font-medium mb-8">o $13.30 al día</div>

              <div className="h-px bg-slate-200 dark:bg-white/10 mb-8 shrink-0" />

              <ul className="space-y-4 mb-8 flex-grow">
                {[
                  "1 sucursal y 1 programa de lealtad con tus colores",
                  "Manejo de roles (Administrador y Empleados)",
                  "Panel de análisis de audiencia (descubre quién volvió, cuándo y cuánto compró)",
                  "1 Zona de notificación automática (radio de 100m)",
                  "Soporte directo"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href="/onboarding" className="mt-auto block w-full py-4 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Crear cuenta
              </Link>
            </div>

            {/* PLAN PRO */}
            <div className="flex flex-col bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-8 border-2 border-emerald-500 shadow-2xl relative md:scale-[1.03] z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Recomendado
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 text-sm mb-6 h-10">Para negocios en crecimiento y sucursales.</p>

              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">$799</span>
                <span className="text-slate-400">/mes</span>
              </div>
              <div className="text-sm text-emerald-400 font-medium mb-8">o $26.63 al día</div>

              <div className="h-px bg-white/10 mb-8 shrink-0" />

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3 text-emerald-300 font-bold pb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm">Todo lo del plan Básico, más:</span>
                </li>
                {[
                  "Hasta 3 sucursales y 3 programas de lealtad",
                  "Zonas de notificación independientes para cada local",
                  "Campañas de cumpleaños automáticas"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link href="/onboarding" className="mt-auto block w-full py-4 text-center rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                Crear cuenta
              </Link>
            </div>

            {/* PLAN PREMIUM */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Premium</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">Sin límites. Para empresas y franquicias.</p>

              <div className="mb-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$1,630</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <div className="text-sm text-slate-500 font-medium mb-8">o $54.33 al día</div>

              <div className="h-px bg-slate-200 dark:bg-white/10 mb-8 shrink-0" />

              <div className="flex-grow flex flex-col">
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3 text-slate-900 dark:text-white font-bold pb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Todo lo del plan Pro, más:</span>
                  </li>
                  {[
                    "Sucursales y programas de lealtad ilimitados",
                    "Zonas de notificación ilimitadas",
                    "Estrategias automáticas con IA (sugerencias de notificaciones)",
                    "Onboarding y configuración personalizada 1 a 1"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/onboarding" className="mt-auto block w-full py-4 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Crear cuenta
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4.5. SECCION SOPORTE */}
      <section className="py-24 bg-slate-900 dark:bg-black relative overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-6 max-w-5xl z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm mb-6 tracking-wide uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Soporte Dedicado
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              ¿Prefieres hacerlo acompañado?
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              Sabemos que tu tiempo es oro. Un experto de nuestro equipo configura tu tarjeta contigo paso a paso, <strong className="text-emerald-400">100% gratis</strong> y sin compromisos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Tarjeta Llamada */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl flex flex-col h-full border border-slate-200 dark:border-white/10 group hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sesión de Configuración</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">15 minutos, uno a uno</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                Agenda una videollamada corta. Te llevamos de la mano en la plataforma y terminamos la reunión con tu primer programa de lealtad funcionando.
              </p>
              <Link href="/onboarding" className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                Agendar llamada gratis <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Tarjeta WhatsApp */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl flex flex-col h-full border border-slate-200 dark:border-white/10 group hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Chat con un humano</h3>
                  <p className="text-sm text-[#25D366] font-medium">Respuesta rápida del equipo</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                ¿Tienes una duda rápida o te atoraste en un paso? Escríbenos directamente a nuestro WhatsApp oficial (+52 777 287 2685) y te contestamos de inmediato.
              </p>
              <a href="https://wa.me/527772872685" target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-colors flex justify-center items-center gap-2 shadow-lg shadow-[#25D366]/20">
                Abrir chat en WhatsApp <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          <div className="text-center mt-12 text-slate-500 dark:text-slate-400 font-medium">
            O si prefieres el método clásico, escríbenos a: <a href="mailto:oswaldodavi_13@hotmail.com" className="text-emerald-500 hover:underline">oswaldodavi_13@hotmail.com</a>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Preguntas Frecuentes</h2>
            <p className="text-slate-600 dark:text-slate-400">Todo lo que necesitas saber sobre LoyalPass.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-white/10">
            <FAQItem
              question="¿Mi cliente tiene que descargar alguna app?"
              answer="No. Este es nuestro mayor beneficio. La tarjeta se guarda directamente en Apple Wallet o Google Wallet, aplicaciones que ya vienen instaladas en el 99% de los teléfonos."
            />
            <FAQItem
              question="¿Cómo doy los sellos o puntos a los clientes?"
              answer="Tienes dos opciones: puedes escanear el código QR de su tarjeta con la cámara de tu celular o tablet (usando nuestra app para cajeros), o puedes buscar su nombre en el sistema y añadir el sello manualmente."
            />
            <FAQItem
              question="¿Necesito comprar hardware especial?"
              answer="No, puedes usar cualquier smartphone (Android o iPhone) o tablet que ya tengas en tu negocio. Funciona desde el navegador o nuestra web-app."
            />
            <FAQItem
              question="¿Qué son las zonas de notificación?"
              answer="Son notificaciones push que aparecen automáticamente en la pantalla de bloqueo de tu cliente cuando pasa físicamente cerca de tu local (aprox. 100 metros), recordándole que tiene puntos o que debe visitarte."
            />
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                <div className="h-10 md:h-12 relative w-48 flex items-center justify-center md:justify-start transform group-hover:scale-105 transition-transform">
                  <Image src="/logo/color%20definitivo%20con%20titutlo.svg" alt="LoyalPass" fill className="object-contain md:object-left" />
                </div>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-center md:text-left">
                La plataforma de lealtad digital que hace que tus clientes vuelvan una y otra vez.
              </p>
            </div>

            <div className="flex gap-12">
              <div className="flex flex-col gap-3 text-center md:text-left">
                <span className="font-bold text-slate-900 dark:text-white mb-2">Producto</span>
                <Link href="#como-funciona" className="text-sm text-slate-500 hover:text-emerald-500 transition-colors">Cómo funciona</Link>
                <Link href="#precios" className="text-sm text-slate-500 hover:text-emerald-500 transition-colors">Precios</Link>
              </div>
              <div className="flex flex-col gap-3 text-center md:text-left">
                <span className="font-bold text-slate-900 dark:text-white mb-2">Soporte</span>
                <Link href="#faq" className="text-sm text-slate-500 hover:text-emerald-500 transition-colors">FAQ</Link>
                <a href="mailto:hola@loyalpass.com" className="text-sm text-slate-500 hover:text-emerald-500 transition-colors">Contacto</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} LoyalPass. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <Link href="/privacidad" className="text-sm text-slate-500 hover:text-emerald-500 transition-colors">Privacidad</Link>
              <Link href="/terminos" className="text-sm text-slate-500 hover:text-emerald-500 transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
