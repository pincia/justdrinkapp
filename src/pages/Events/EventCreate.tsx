import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EventForm from "./EventForm";
import { createEvent } from "../../services/eventsApi";
import { EventCreateDto } from "../../types/Event";
import { useState } from "react";

export default function EventCreate() {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(dto: EventCreateDto) {
    try {
      setSaving(true);
      await createEvent(dto);
      navigate("/events");
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Failed to create event");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="New Event" description="Create a new event" />
      <PageBreadcrumb pageTitle="New Event" />
      <EventForm onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
