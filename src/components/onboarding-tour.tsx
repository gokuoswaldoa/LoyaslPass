"use client";

import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps } from "react-joyride";
import { usePathname } from "next/navigation";
import { CheckCircle, X, ChevronRight, ChevronLeft } from "lucide-react";

export function OnboardingTour() {
  const [run, setRun] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Solo ejecutamos el tour en la página principal del dashboard
    if (pathname !== "/dashboard") return;

    // Revisamos si ya completó el tour
    const tourCompleted = localStorage.getItem("loyalpass_tour_completed");
    
    // Esperamos un momento para que cargue la interfaz antes de iniciar
    if (!tourCompleted) {
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("loyalpass_tour_completed", "true");
    }
  };

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      title: "¡Bienvenido a LoyalPass! 🎉",
      content: "Vamos a darte un recorrido rápido por tu panel de control para que comiences a fidelizar a tus clientes hoy mismo.",
      disableBeacon: true,
    },
    {
      target: "#tour-qr-registro",
      title: "El Corazón de tu Negocio",
      content: "Muestra este QR a tus clientes para que descarguen su tarjeta en su celular. También usa los botones debajo para copiar el link o probar el flujo.",
      placement: "bottom",
    },
    {
      target: "#tour-diseno",
      title: "Personaliza tu Tarjeta",
      content: "Aquí podrás subir tu logo, elegir tus colores y configurar las recompensas que le darás a tus clientes.",
      placement: "right",
    },
    {
      target: "#tour-clientes",
      title: "Conoce a tus Clientes",
      content: "Tu base de datos de clientes. Observa cuántas visitas tienen, dales sellos manualmente y averigua quiénes han dejado de venir.",
      placement: "right",
    },
    {
      target: "#tour-marketing",
      title: "Atrae a tus Clientes",
      content: "Envía notificaciones push directamente al celular de tus clientes (Ej: '¡Hoy 2x1 en toda la tienda!') para que regresen más seguido.",
      placement: "right",
    },
    {
      target: "#tour-configuracion",
      title: "Configuración y Equipo",
      content: "Administra los detalles de tu cuenta y, en el futuro, podrás dar acceso a tus empleados para que escaneen desde sus celulares.",
      placement: "right",
    },
  ];

  // Componente Tooltip Personalizado con efecto Glassmorphism
  const Tooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep,
  }: TooltipRenderProps) => {
    return (
      <div
        {...tooltipProps}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full font-sans relative"
      >
        <button
          {...closeProps}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Omitir Tour"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 pr-6">
          {step.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {step.content}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-4 bg-emerald-500" : "w-2 bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                {...backProps}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Atrás
              </button>
            )}
            
            <button
              {...primaryProps}
              className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              {isLastStep ? (
                <>Finalizar <CheckCircle size={16} /></>
              ) : (
                <>Siguiente <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      tooltipComponent={Tooltip}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: 'transparent',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    />
  );
}
