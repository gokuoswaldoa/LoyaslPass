export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isPast = stepNumber < currentStep;

        return (
          <div key={i} className="flex items-center">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-emerald-500"
                  : isPast
                  ? "w-8 bg-emerald-500/40"
                  : "w-2 bg-slate-200 dark:bg-slate-800"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
