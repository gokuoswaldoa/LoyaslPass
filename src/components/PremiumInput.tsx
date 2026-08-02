"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative group">
        <motion.div
          initial={false}
          animate={{
            opacity: isFocused ? 1 : 0.5,
            scale: isFocused ? 1 : 0.98,
          }}
          className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500"
        />
        <div className="relative flex flex-col bg-white dark:bg-gray-900 rounded-xl px-4 py-2 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wide uppercase z-10">
            {label}
          </label>
          <div className="flex items-center w-full z-10">
            {type === 'color' ? (
              <div className="relative flex items-center gap-3 w-full h-8 cursor-pointer group/color">
                <input 
                  type="color" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  ref={ref}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  {...props} 
                />
                <div 
                  className="w-6 h-6 rounded-full shadow-inner ring-2 ring-black/10 dark:ring-white/20 transition-transform group-hover/color:scale-110" 
                  style={{ backgroundColor: props.value as string || '#10b981' }} 
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover/color:text-emerald-500 transition-colors">
                  Elegir color
                </span>
              </div>
            ) : (
              <input
                type={type}
                className={cn(
                  "flex w-full bg-transparent text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0",
                  className
                )}
                onFocus={(e) => {
                  setIsFocused(true);
                  props.onFocus?.(e);
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                  props.onBlur?.(e);
                }}
                ref={ref}
                {...props}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";
