// src/types/Event.ts
export enum EventType {
  Wedding = 0,
  Corporate = 1,
  PrivateParty = 2,
  Other = 3,
}

export enum EventStatus {
  Planned = 0,
  Confirmed = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface EventListItemDto {
  id: number;
  name: string;
  eventType: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  customerName?: string;
  locationName?: string;
}

export interface EventDetailDto {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  eventType: EventType;
  status: EventStatus;
  contactPerson?: string;
  contactPhone?: string;
  customerId: number;
  customerName?: string;
  locationId?: number;
  locationName?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventCreateDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  eventType: EventType;
  status: EventStatus;
  contactPerson?: string;
  contactPhone?: string;
  customerId: number;
  locationId?: number;
}

export type EventUpdateDto = EventCreateDto;
