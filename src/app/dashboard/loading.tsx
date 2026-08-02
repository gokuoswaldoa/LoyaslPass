export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-10 pb-32 w-full max-w-7xl mx-auto min-h-screen">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="w-full">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-3"></div>
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-40">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse mb-6"></div>
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse"></div>
            <div className="h-10 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Main Area Skeleton */}
      <div className="w-full h-96 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando datos...</p>
        </div>
      </div>
    </div>
  );
}
