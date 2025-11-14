import {
  LocationListItemDto,
  LocationDetailDto,
  LocationCreateDto,
  LocationUpdateDto,
} from "../types/Location";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE}/locations`;

export async function getLocations(search?: string): Promise<LocationListItemDto[]> {
  const url = search ? `${BASE_URL}?search=${encodeURIComponent(search)}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function getLocationById(id: number): Promise<LocationDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Location not found");
  return res.json();
}

export async function createLocation(dto: LocationCreateDto): Promise<LocationDetailDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to create location");
  return res.json();
}

export async function updateLocation(id: number, dto: LocationUpdateDto): Promise<LocationDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to update location");
  return res.json();
}

export async function deleteLocation(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete location");
}
