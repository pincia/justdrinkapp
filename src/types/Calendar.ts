// tipi di categoria (mappano il tuo enum backend)
export type CalendarEventCategory = "Primary" | "Success" | "Warning" | "Danger";

export interface CalendarEventDto {
  id: number;
  title: string;
  start: string;
  end?: string | null;

  category: CalendarEventCategory;
  eventType: string;

  eventId?: number | null;

  isSystemGenerated: boolean;
}

export interface CalendarEventUpsertDto {
  title: string;
  start: string;
  end?: string | null;

  category: CalendarEventCategory;
  eventType: string;

  eventId?: number | null;

  isSystemGenerated?: boolean;
}
