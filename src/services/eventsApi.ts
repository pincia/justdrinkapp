import {
  EventListItemDto,
  EventDetailDto,
  EventCreateDto,
  EventUpdateDto,
} from "../types/Event";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE}/events`;

// 🔹 GET /api/events
export async function getEvents(search?: string): Promise<EventListItemDto[]> {
  const url = search ? `${BASE_URL}?search=${encodeURIComponent(search)}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

// 🔹 GET /api/events/{id}
export async function getEventById(id: number): Promise<EventDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}

// 🔹 POST /api/events
export async function createEvent(dto: EventCreateDto): Promise<EventDetailDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

// 🔹 PUT /api/events/{id}
export async function updateEvent(id: number, dto: EventUpdateDto): Promise<EventDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

// 🔹 DELETE /api/events/{id}
export async function deleteEvent(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete event");
}
