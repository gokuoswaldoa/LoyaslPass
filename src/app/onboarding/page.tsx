"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Step1Type } from "./components/Step1Type";
import { Step3Stamps } from "./components/Step3Stamps";
import { Step4Reward } from "./components/Step4Reward";
import { Step5Name } from "./components/Step5Name";
import { Step6Style } from "./components/Step6Style";
import { Step7Success } from "./components/Step7Success";
import { ProgressBar } from "./components/ProgressBar";

export type OnboardingData = {
  businessType: string;
  stampsCount: number;
  reward: string;
  businessName: string;
  styleTheme: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    businessType: "cafeteria",
    stampsCount: 8,
    reward: "",
    businessName: "",
    styleTheme: "lujo",
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const slideVariants = {
    initial: { x: 50, opacity: 0 },
    enter: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Header con botón de regresar y progreso */}
        <div className="w-full flex items-center justify-between mb-12">
          {step > 1 && step < 6 ? (
            <button 
              onClick={prevStep}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" /> /* Spacer */
          )}
          
          <ProgressBar currentStep={step} totalSteps={6} />
          
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Contenedor animado de los pasos */}
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {step === 1 && <Step1Type data={data} updateData={updateData} onNext={nextStep} />}
              {step === 2 && <Step3Stamps data={data} updateData={updateData} onNext={nextStep} />}
              {step === 3 && <Step4Reward data={data} updateData={updateData} onNext={nextStep} />}
              {step === 4 && <Step5Name data={data} updateData={updateData} onNext={nextStep} />}
              {step === 5 && <Step6Style data={data} updateData={updateData} onNext={nextStep} />}
              {step === 6 && <Step7Success data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
