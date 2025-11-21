// src/services/checklistTemplatesApi.ts
import { ChecklistTemplateDto, ChecklistTemplateCreateDto } from "../types/Checklist";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE}/checklist-templates`; // route backend: [Route("api/checklist-templates")]

export async function getChecklistTemplates(search?: string): Promise<ChecklistTemplateDto[]> {
  const url = search && search.trim()
    ? `${BASE_URL}?search=${encodeURIComponent(search.trim())}`
    : BASE_URL;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Impossibile caricare i template checklist");
  return res.json();
}

export async function getChecklistTemplateById(id: number): Promise<ChecklistTemplateDto> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Template checklist non trovato");
  return res.json();
}

export async function createChecklistTemplate(dto: ChecklistTemplateCreateDto): Promise<ChecklistTemplateDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Errore durante la creazione del template");
  return res.json();
}

export async function updateChecklistTemplate(id: number, dto: ChecklistTemplateCreateDto): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Errore durante l'aggiornamento del template");
}

export async function deleteChecklistTemplate(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Errore durante l'eliminazione del template");
}
