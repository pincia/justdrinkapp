// Same values as backend enum ChecklistStatus
export enum ChecklistStatus {
  ToDo = 0,
  Done = 1,
  NotNeeded = 2,
}

export interface EventChecklistItemDto {
  id: number;
  eventId: number;
  templateItemId: number;
  title: string;
  description?: string | null;
  category?: string | null;
  status: ChecklistStatus;
  priority: number; // 1 = high, 2 = medium, 3 = low
  notes?: string | null;
}

export interface EventChecklistItemUpdateDto {
  status: ChecklistStatus;
  priority: number;
  notes?: string | null;
}

export interface EventChecklistItemCreateDto {
  title: string;
  description?: string | null;
  category?: string | null;
  priority: number;
}

// TEMPLATE

export interface EventChecklistTemplateItemDto {
  id: number;
  title: string;
  description?: string | null;
  priority: number;
  isActive: boolean;
  category?: string | null;
  sortOrder?: number | null;
}

export interface EventChecklistTemplateItemCreateDto {
  title: string;
  description?: string | null;
  priority: number;
  isActive: boolean;
  category?: string | null;
  sortOrder?: number | null;
}

export interface EventChecklistTemplateItemUpdateDto
  extends EventChecklistTemplateItemCreateDto {}
