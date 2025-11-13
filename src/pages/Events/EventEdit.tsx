import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EventForm from "./EventForm";
import { getEventById, updateEvent } from "../../services/eventsApi";
import { EventDetailDto, EventCreateDto } from "../../types/Event";

export default function EventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetailDto | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getEventById(Number(id));
      setEvent(data);
    }
    load();
  }, [id]);

  async function handleSubmit(dto: EventCreateDto) {
    try {
      setSaving(true);
      await updateEvent(Number(id), dto);
      navigate("/events");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  }

  if (!event) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Edit Event" description="Modify event details" />
      <PageBreadcrumb pageTitle="Edit Event" />
      <EventForm initialData={event} onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
