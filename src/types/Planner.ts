// src/types/Planner.ts

export enum PlannerType {
  WeddingPlanner = 0,
  Organizer = 1,
  Other = 2,
}

export interface PlannerListItemDto {
  id: number;
  fullName: string;
  companyName?: string | null;
  type: PlannerType;
}

export interface PlannerDetailDto {
  id: number;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  type: PlannerType;
  notes?: string | null;
}

export interface PlannerCreateDto {
  firstName: string;
  lastName: string;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  type: PlannerType;
  notes?: string | null;
}

export type PlannerUpdateDto = PlannerCreateDto;
