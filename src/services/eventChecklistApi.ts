// src/services/eventChecklistApi.ts
import {
  EventChecklistItemDto,
  EventChecklistItemUpdateDto,
} from "../types/Checklist";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// /api/events/{eventId}/checklist
function baseUrl(eventId: number) {
  return `${API_BASE}/events/${eventId}/checklist`;
}

export async function getEventChecklist(eventId: number): Promise<EventChecklistItemDto[]> {
  const res = await fetch(baseUrl(eventId));
  if (!res.ok) throw new Error("Impossibile caricare la checklist dell'evento");
  return res.json();
}

export async function addEventChecklistItem(
  eventId: number,
  label: string
): Promise<EventChecklistItemDto> {
  const res = await fetch(baseUrl(eventId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) throw new Error("Errore durante l'aggiunta dell'elemento");
  return res.json();
}

export async function updateEventChecklistItem(
  eventId: number,
  itemId: number,
  dto: EventChecklistItemUpdateDto
): Promise<void> {
  const res = await fetch(`${baseUrl(eventId)}/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Errore durante l'aggiornamento dell'elemento");
}

export async function deleteEventChecklistItem(
  eventId: number,
  itemId: number
): Promise<void> {
  const res = await fetch(`${baseUrl(eventId)}/${itemId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Errore durante l'eliminazione dell'elemento");
}
