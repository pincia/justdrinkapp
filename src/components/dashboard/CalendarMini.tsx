import { DashboardEventItem } from "../../types/Dashboard";
import { Link } from "react-router-dom";

interface Props {
  events: DashboardEventItem[];
}

export default function CalendarMini({ events }: Props) {
  return (
    <div className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold mb-4">Calendario</h3>

      <ul className="space-y-3">
        {events.map(ev => (
          <li key={ev.id} className="flex justify-between items-center">
            <div>
              <Link to={`/events/${ev.id}`} className="font-medium hover:underline">
                {ev.name}
              </Link>
              <p className="text-xs text-gray-500">
                {new Date(ev.date).toLocaleDateString("it-IT")}
              </p>
            </div>

            <span className="px-2 py-1 rounded-md text-xs bg-brand-500 text-white">
              {new Date(ev.date).getDate()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
