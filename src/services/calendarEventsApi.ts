// src/services/calendarEventsApi.ts
import {
  CalendarEventDto,
  CalendarEventUpsertDto,
} from "../types/Calendar";

// Legge l'URL base dalle env di Vite
const API_BASE = import.meta.env.VITE_API_BASE_URL; // /api in dev, https://.../api in prod
const BASE_URL = `${API_BASE}/calendarevents`;

export async function getCalendarEvents(): Promise<CalendarEventDto[]> {
  const res = await fetch(BASE_URL, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch calendar events");
  return res.json();
}

export async function getCalendarEventById(
  id: number
): Promise<CalendarEventDto> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Calendar event not found");
  return res.json();
}

export async function createCalendarEvent(
  dto: CalendarEventUpsertDto
): Promise<CalendarEventDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to create calendar event");
  return res.json();
}

export async function updateCalendarEvent(
  id: number,
  dto: CalendarEventUpsertDto
): Promise<CalendarEventDto> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to update calendar event");
  return res.json();
}

export async function deleteCalendarEvent(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete calendar event");
}
