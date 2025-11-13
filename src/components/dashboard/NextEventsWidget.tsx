import { DashboardEventItem } from "../../types/Dashboard";
import Badge from "../ui/badge/Badge";
import { Link } from "react-router-dom";

interface Props {
  events: DashboardEventItem[];
}

const statusColorMap = {
  Planned: "primary",
  Confirmed: "success",
  Completed: "dark",
  Cancelled: "error",
} as const;

export default function NextEventsWidget({ events }: Props) {
  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold mb-4">Prossimi Eventi</h3>

      <ul className="space-y-4">
        {events.map(ev => (
          <li key={ev.id} className="flex justify-between border-b pb-3 last:border-none">
            <div>
              <Link to={`/events/${ev.id}`} className="font-medium hover:underline">
                {ev.name}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(ev.date).toLocaleDateString("it-IT")}
              </p>
            </div>

            <Badge color={statusColorMap[ev.status]} size="sm" variant="light">
              {ev.status}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
