import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EventForm from "./EventForm";
import { getEventById } from "../../services/eventsApi";
import { EventDetailDto } from "../../types/Event";
import ComponentCard from "../../components/common/ComponentCard";
import EventPayments from "../../components/ui/payments/EventPayments";
import EventChecklistPanel from "../Checklist/EventChecklistPanel";
import EntityFilesPanel from "../../components/entityFiles/EntityFilesPanel";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetailDto | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getEventById(Number(id));
      setEvent(data);
    }
    load();
  }, [id]);

  if (!event) return <div className="p-6 text-gray-500">Caricamento...</div>;

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Dettagli Evento" description="Visualizza le informazioni dell'evento" />
      <PageBreadcrumb pageTitle="Dettagli Evento" />

      {/* FORM SOLO LETTURA */}
      <EventForm initialData={event} readOnly />

      {/* RIEPILOGO IMPORTI */}
      <ComponentCard title="Riepilogo Pagamenti">
        <div className="space-y-2 text-sm">
          <p>
            <strong>Totale Pagato:</strong>{" "}
            € {event.paidAmount?.toFixed(2) ?? "0.00"}
          </p>
          <p>
            <strong>Da Pagare:</strong>{" "}
            € {event.remainingAmount?.toFixed(2) ?? "0.00"}
          </p>
          <p>
            <strong>Numero Pagamenti:</strong>{" "}
            {event.payments?.length ?? 0}
          </p>
        </div>
      </ComponentCard>

      {/* CHECKLIST EVENTO */}
      <ComponentCard title="Checklist Evento">
        <EventChecklistPanel eventId={event.id} />
      </ComponentCard>

      {/* TABELLA PAGAMENTI */}
      <ComponentCard title="Pagamenti">
        <EventPayments eventId={event.id} />
      </ComponentCard>

      {/* FILES EVENTO */}
      <ComponentCard title="Documenti Evento">
        <EntityFilesPanel entityType="Event" entityId={event.id} />
      </ComponentCard>
    </div>
  );
}
