import { DashboardOfferMonthlyStats } from "../../types/Dashboard";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
  stats: DashboardOfferMonthlyStats[];
}

export default function OffersStatsWidget({ stats }: Props) {
  const options: ApexOptions = {
    chart: { type: "bar", height: 240, toolbar: { show: false } },
    xaxis: { categories: stats.map(s => s.month) },
    plotOptions: { bar: { columnWidth: "45%", borderRadius: 4 } },
    colors: ["#3B82F6", "#F59E0B", "#16A34A", "#DC2626"],
  };

  const series = [
    { name: "Creati", data: stats.map(s => s.created) },
    { name: "Inviati", data: stats.map(s => s.sent) },
    { name: "Accettati", data: stats.map(s => s.accepted) },
    { name: "Rifiutati", data: stats.map(s => s.rejected) },
  ];

  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold mb-2">Statistiche Preventivi</h3>
      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}
