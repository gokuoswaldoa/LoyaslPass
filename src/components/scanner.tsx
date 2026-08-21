"use client";

import { Scanner as ReactScanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ScannerProps {
  onScanSuccess: (data: string) => void;
  isProcessing?: boolean;
}

export function Scanner({ onScanSuccess, isProcessing = false }: ScannerProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full max-w-sm mx-auto relative overflow-hidden rounded-[2rem] bg-slate-900 border-4 border-slate-800 shadow-2xl">
      {/* Header/Overlay */}
      <div className="absolute top-0 inset-x-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none flex justify-center">
        <p className="text-white/90 text-sm font-bold tracking-wide">Alinea el código QR</p>
      </div>

      <div className="relative aspect-square w-full">
        {!isProcessing ? (
          <ReactScanner
            onScan={(result) => {
              if (result && result.length > 0) {
                // Return the first detected QR code value
                onScanSuccess(result[0].rawValue);
              }
            }}
            onError={(error) => {
              console.error(error);
              setError("No se pudo acceder a la cámara o hubo un error de lectura.");
            }}
            components={{
              audio: false,
              // @ts-expect-error
              tracker: true,
            }}
            styles={{
              container: { width: '100%', height: '100%' },
              video: { objectFit: 'cover' }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-bold">Procesando cliente...</p>
          </div>
        )}

        {/* Scan Frame Overlay */}
        {!isProcessing && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white/50 rounded-2xl relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl"></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute bottom-4 inset-x-4 bg-red-500/90 backdrop-blur-md text-white p-3 rounded-xl flex items-start gap-2 text-sm font-medium z-20">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
