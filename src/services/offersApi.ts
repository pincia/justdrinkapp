// src/services/offersApi.ts
import {
  OfferListItem,
  OfferDetail,
  OfferCreateDto,
  OfferAttachmentDto,
  OfferStatus
} from "../types/Offer";
const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/offers`;

// Opzionale: tipo di filtro lato FE (coerente con OfferFilterDto del backend)
export type OfferFilter = {
  search?: string;
  customerId?: number;
  eventId?: number;
  status?: string;          // "Draft" | "Sent" | "Accepted" | ...
  from?: string;            // ISO date (YYYY-MM-DD)
  to?: string;              // ISO date (YYYY-MM-DD)
  expired?: boolean;
  page?: number;
  pageSize?: number;
};

function toQuery(params: OfferFilter = {}) {
  const q = new URLSearchParams();
  if (params.search) q.append("search", params.search);
  if (params.customerId != null) q.append("customerId", String(params.customerId));
  if (params.eventId != null) q.append("eventId", String(params.eventId));
  if (params.status) q.append("status", params.status);
  if (params.from) q.append("from", params.from);
  if (params.to) q.append("to", params.to);
  if (params.expired != null) q.append("expired", String(params.expired));
  if (params.page != null) q.append("page", String(params.page));
  if (params.pageSize != null) q.append("pageSize", String(params.pageSize));
  const s = q.toString();
  return s ? `?${s}` : "";
}

// LIST con filtri
export async function getOffers(filter?: OfferFilter): Promise<OfferListItem[]> {
  const res = await fetch(`${BASE_URL}${toQuery(filter)}`);
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
}

// DETAIL
export async function getOfferById(id: number): Promise<OfferDetail> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Offer not found");
  return res.json();
}

// CREATE
export async function createOffer(dto: OfferCreateDto): Promise<OfferDetail> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to create offer");
  return res.json();
}

// UPDATE (se implementi il PUT nel tuo OffersController)
export async function updateOffer(id: number, dto: OfferCreateDto): Promise<OfferDetail> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to update offer");
  return res.json();
}

// DELETE
export async function deleteOffer(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete offer");
}

// UPLOAD allegato (endpoint suggerito: POST /api/offers/{id}/attachments)
export async function uploadOfferAttachment(
  offerId: number,
  file: File
): Promise<OfferAttachmentDto> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/${offerId}/attachments`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload attachment");
  return res.json();
}


export async function updateOfferStatus(
  id: number,
  status: OfferStatus
): Promise<void> {
  const res = await fetch(`/api/offers/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update offer status");
}
