// src/types/Checklist.ts

// Priorità di un elemento checklist
export enum ChecklistItemPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

// Stato di un elemento checklist (sul singolo evento)
export enum ChecklistItemStatus {
  Todo = 0,
  Done = 1,
  NotNeeded = 2,
}

// ==== TEMPLATE CHECKLIST (CONFIGURAZIONE) ====

export interface ChecklistTemplateDto {
  id: number;
  title: string;
  description?: string;
  priority: ChecklistItemPriority;
  isActive: boolean;
  eventType?: number | null;
}

export interface ChecklistTemplateCreateDto {
  title: string;
  description?: string;
  priority: ChecklistItemPriority;
  isActive: boolean;
  eventType?: number | null;
}

// ==== CHECKLIST EVENTO (OPERATIVA) ====

export interface EventChecklistItemDto {
  id: number;
  eventId: number;
  templateTitle: string;
  notes?: string;
  priority: ChecklistItemPriority;
  status: ChecklistItemStatus;
  // opzionale se in backend c'è ordinamento
  sortOrder?: number;
}

export interface EventChecklistItemUpdateDto {
  label?: string;
  notes?: string;
  priority?: ChecklistItemPriority;
  status?: ChecklistItemStatus;
}
