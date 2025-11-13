import {
  DashboardEventItem,
  DashboardKpiResponse,
  DashboardOfferMonthlyStats,
  DashboardRevenue,
} from "../types/Dashboard";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/dashboard`;

// ------------ Next Events ------------
export async function getDashboardKpis(): Promise<DashboardKpiResponse> {
  const res = await fetch(`${BASE_URL}/kpi`);
  return res.json();
}

export async function getNextEvents(): Promise<DashboardEventItem[]> {
  const res = await fetch(`${BASE_URL}/events/next`);
  return res.json();
}

export async function getOfferStats(): Promise<DashboardOfferMonthlyStats[]> {
  const res = await fetch(`${BASE_URL}/offers/monthly`);
  return res.json();
}

export async function getExpectedRevenue(): Promise<DashboardRevenue[]> {
  const res = await fetch(`${BASE_URL}/revenue/expected`);
  return res.json();
}