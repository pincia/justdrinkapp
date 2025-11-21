import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, deleteEvent } from "../../services/eventsApi";
import { EventListItemDto, EventStatus, EventType } from "../../types/Event";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react";

export default function EventsList() {
  const [events, setEvents] = useState<EventListItemDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getEvents(search);
      setEvents(data);
    } catch (err) {
      console.error("❌ Error loading events:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Sei sicuro di voler eliminare questo evento?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Impossibile eliminare l'evento");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-3 sm:mb-0">Eventi</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={load}>
            Cerca
          </Button>
          <Link to="/events/new">
            <Button variant="primary" size="sm" startIcon={<PlusIcon className="size-4" />}>
              Nuovo Evento
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Caricamento...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Nome</TableCell>
                  <TableCell isHeader>Tipo</TableCell>
                  <TableCell isHeader>Stato</TableCell>
                  <TableCell isHeader>Data</TableCell>
                  <TableCell isHeader>Cliente</TableCell>
                  <TableCell isHeader>Location</TableCell>
                  <TableCell isHeader className="text-center">Azioni</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{EventType[e.eventType]}</TableCell>
                    <TableCell>
                      <Badge
                        size="sm"
                        color={
                          e.status === EventStatus.Planned
                            ? "warning"
                            : e.status === EventStatus.Confirmed
                            ? "info"
                            : e.status === EventStatus.Completed
                            ? "success"
                            : "error"
                        }
                      >
                        {EventStatus[e.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(e.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{e.customerName || "-"}</TableCell>
                    <TableCell>{e.locationName || "-"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/events/${e.id}`}>
                          <Button size="sm" variant="outline" startIcon={<EyeIcon className="size-4" />}>
                            Vedi
                          </Button>
                        </Link>
                        <Link to={`/events/${e.id}/edit`}>
                          <Button size="sm" variant="outline" startIcon={<PencilIcon className="size-4" />}>
                            Modifica
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={<TrashIcon className="size-4 text-red-500" />}
                          onClick={() => handleDelete(e.id)}
                        >
                          Elimina
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
