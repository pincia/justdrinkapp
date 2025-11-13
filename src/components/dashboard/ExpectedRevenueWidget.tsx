import { DashboardRevenue } from "../../types/Dashboard";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Props {
  data: DashboardRevenue[];
}

export default function ExpectedRevenueWidget({ data }: Props) {
  const options: ApexOptions = {
    chart: { type: "area", height: 220, toolbar: { show: false } },
    xaxis: { categories: data.map(d => d.month) },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0 } },
    colors: ["#465FFF"],
    dataLabels: { enabled: false },
  };

  const series = [
    {
      name: "Fatturato Previsto",
      data: data.map(d => d.value),
    },
  ];

  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold mb-2">Fatturato Previsto</h3>
      <Chart options={options} series={series} type="area" height={220} />
    </div>
  );
}
