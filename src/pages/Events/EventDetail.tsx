import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EventForm from "./EventForm";
import { getEventById } from "../../services/eventsApi";
import { EventDetailDto } from "../../types/Event";

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

  if (!event) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Event Details" description="View event information" />
      <PageBreadcrumb pageTitle="Event Details" />
      <EventForm initialData={event} readOnly />
    </div>
  );
}
