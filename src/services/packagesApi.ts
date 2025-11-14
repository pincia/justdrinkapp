// src/services/packagesApi.ts
import {
  PackageListItemDto,
  PackageDetailDto,
  PackageCreateDto,
  PackageUpdateDto,
} from "../types/Package";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE}/packages`;

export type PackageFilter = {
  search?: string;
  category?: string;   // "Standard" | "Premium" | "Extra" | "Custom"
  priceType?: string;  // "PerPerson" | "Flat"
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

function toQuery(f?: PackageFilter) {
  const q = new URLSearchParams();
  if (!f) return "";
  if (f.search) q.append("search", f.search);
  if (f.category) q.append("category", f.category);
  if (f.priceType) q.append("priceType", f.priceType);
  if (typeof f.isActive === "boolean") q.append("isActive", String(f.isActive));
  if (f.page) q.append("page", String(f.page));
  if (f.pageSize) q.append("pageSize", String(f.pageSize));
  const s = q.toString();
  return s ? `?${s}` : "";
}

// LIST
export async function getPackages(filter?: PackageFilter): Promise<PackageListItemDto[]> {
  const res = await fetch(`${BASE_URL}${toQuery(filter)}`);
  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
}

// DETAIL
export async function getPackageById(id: number): Promise<PackageDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Package not found");
  return res.json();
}

// CREATE
export async function createPackage(dto: PackageCreateDto): Promise<PackageDetailDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to create package");
  return res.json();
}

// UPDATE
export async function updatePackage(id: number, dto: PackageUpdateDto): Promise<PackageDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to update package");
  return res.json();
}

// DELETE
export async function deletePackage(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete package");
}
