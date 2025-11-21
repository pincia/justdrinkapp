import { PaymentDetailDto } from "./Payment";

// src/types/Event.ts
export enum EventType {
  Matrimonio = 1,
  Aziendale = 2,
  Privato = 3,
  Pubblico = 4,
  MixologyExperience = 5
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
  customerName?: string;
  locationName?: string;
}

export interface EventDetailDto {
  id: number;
  name: string;
  description?: string;
  startDate: string;
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
  paidAmount: number;
  remainingAmount: number;
  payments: PaymentDetailDto[]; 
  plannerId?: number;
  plannerName?: string;
}

export interface EventCreateDto {
  name: string;
  description?: string;
  startDate: string;
  eventType: EventType;
  status: EventStatus;
  contactPerson?: string;
  contactPhone?: string;
  customerId: number;
  locationId?: number;
   plannerId?: number;
}

export type EventUpdateDto = EventCreateDto;
