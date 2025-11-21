// src/services/plannersApi.ts
import {
  PlannerListItemDto,
  PlannerDetailDto,
  PlannerCreateDto,
  PlannerUpdateDto,
} from "../types/Planner";

const API = import.meta.env.VITE_API_BASE_URL + "/planners";

export async function getPlanners(): Promise<PlannerListItemDto[]> {
  const res = await fetch(API);
  return res.json();
}

export async function getPlannerById(id: number): Promise<PlannerDetailDto> {
  const res = await fetch(`${API}/${id}`);
  return res.json();
}

export async function createPlanner(dto: PlannerCreateDto): Promise<void> {
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function updatePlanner(id: number, dto: PlannerUpdateDto): Promise<void> {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function deletePlanner(id: number): Promise<void> {
  await fetch(`${API}/${id}`, { method: "DELETE" });
}
