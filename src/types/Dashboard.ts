// ---------------------------------------------------------
// KPI
// ---------------------------------------------------------
export interface DashboardKpiResponse {
  totalEvents: number;
  confirmedEvents: number;
  pendingOffers: number;
  monthlyRevenueEstimate: number;
}

// ---------------------------------------------------------
// NEXT EVENTS
// ---------------------------------------------------------
export type EventStatus = "Planned" | "Confirmed" | "Completed" | "Cancelled";

export interface DashboardEventItem {
  id: number;
  name: string;
  date: string;        // ISO date
  status: EventStatus; // castiamo lato FE
}

// ---------------------------------------------------------
// OFFER MONTHLY STATS (dal backend)
// ---------------------------------------------------------
export interface DashboardOfferMonthlyStats {
  month: string;     // es. "Gen", "Feb"
  created: number;
  sent: number;
  accepted: number;
  rejected: number;
}

// ---------------------------------------------------------
// EXPECTED REVENUE
// ---------------------------------------------------------
export interface DashboardRevenue {
  month: string; // "Gen 2025"
  value: number;
}
