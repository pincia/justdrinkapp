import { DashboardKpiResponse } from "../../types/Dashboard";

interface Props {
  kpi: DashboardKpiResponse;
}

export default function KpiCards({ kpi }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">Eventi Totali</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {kpi.totalEvents}
        </h4>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">Eventi Confermati</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {kpi.confirmedEvents}
        </h4>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">Preventivi in Attesa</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {kpi.pendingOffers}
        </h4>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">Fatturato Previsto</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          € {kpi.monthlyRevenueEstimate.toLocaleString()}
        </h4>
      </div>

    </div>
  );
}
