import {
  PricelistListItemDto,
  PricelistDetailDto,
  PricelistCreateDto,
  PricelistUpdateDto,
} from "../types/Pricelist";
const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/pricelists`;

export async function getPricelists(): Promise<PricelistListItemDto[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Errore nel caricamento dei listini");
  return res.json();
}

export async function getPricelistById(id: number): Promise<PricelistDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Listino non trovato");
  return res.json();
}

export async function createPricelist(dto: PricelistCreateDto): Promise<PricelistDetailDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Errore nella creazione del listino");
  return res.json();
}

export async function updatePricelist(id: number, dto: PricelistUpdateDto): Promise<PricelistDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Errore nell'aggiornamento del listino");
  return res.json();
}

export async function deletePricelist(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Errore nell'eliminazione del listino");
}
