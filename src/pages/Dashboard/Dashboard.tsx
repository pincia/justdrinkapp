import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Badge from "../../components/ui/badge/Badge";

import {
  getDashboardKpis,
  getNextEvents,
  getExpectedRevenue,
  getOfferStats,
} from "../../services/dashboardApi";

import {
  DashboardEventItem,
  DashboardOfferMonthlyStats,
  DashboardRevenue,
  DashboardKpiResponse,
} from "../../types/Dashboard";

import CalendarMini from "../../components/dashboard/CalendarMini";
import NextEventsWidget from "../../components/dashboard/NextEventsWidget";
import OffersStatsWidget from "../../components/dashboard/OffersStatsWidget";
import ExpectedRevenueWidget from "../../components/dashboard/ExpectedRevenueWidget";

export default function Dashboard() {
  const [kpi, setKpi] = useState<DashboardKpiResponse | null>(null);
  const [nextEvents, setNextEvents] = useState<DashboardEventItem[]>([]);
  const [offerStats, setOfferStats] = useState<DashboardOfferMonthlyStats[]>([]);
  const [expectedRevenue, setExpectedRevenue] = useState<DashboardRevenue[]>([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [k, ev, st, rev] = await Promise.all([
        getDashboardKpis(),
        getNextEvents(),
        getOfferStats(),
        getExpectedRevenue(),
      ]);

      setKpi(k);
      setNextEvents(ev);
      setOfferStats(st);
      setExpectedRevenue(rev);
    } catch (err) {
      console.error("Errore dashboard:", err);
    }
  }

  return (
    <>
      <PageMeta title="Dashboard" description="Pannello di controllo JustDrink" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        
        {/* KPI */}
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ComponentCard title = "">
            <p className="text-sm text-gray-500">Eventi Totali</p>
            <h2 className="text-2xl font-bold mt-2">{kpi?.totalEvents ?? "-"}</h2>
            <Badge variant="light" color="primary">Totale</Badge>
          </ComponentCard>
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ComponentCard title = "">
            <p className="text-sm text-gray-500">Eventi Confermati</p>
            <h2 className="text-2xl font-bold mt-2">{kpi?.confirmedEvents ?? "-"}</h2>
            <Badge variant="light" color="success">Confermati</Badge>
          </ComponentCard>
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ComponentCard title = "">
            <p className="text-sm text-gray-500">Preventivi In Attesa</p>
            <h2 className="text-2xl font-bold mt-2">{kpi?.pendingOffers ?? "-"}</h2>
            <Badge variant="light" color="warning">In attesa</Badge>
          </ComponentCard>
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ComponentCard title = "">
            <p className="text-sm text-gray-500">Fatturato Previsto</p>
            <h2 className="text-2xl font-bold mt-2">
              € {kpi?.monthlyRevenueEstimate?.toLocaleString() ?? "-"}
            </h2>
            <Badge variant="light" color="info">Stime mese</Badge>
          </ComponentCard>
        </div>

        {/* Widgets */}
        <div className="col-span-12 xl:col-span-4">
          <CalendarMini events={nextEvents} />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <NextEventsWidget events={nextEvents} />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <OffersStatsWidget stats={offerStats} />
        </div>

        <div className="col-span-12">
          <ExpectedRevenueWidget data={expectedRevenue} />
        </div>

      </div>
    </>
  );
}
