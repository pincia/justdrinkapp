import { CustomerListItemDto, CustomerDetailDto, CustomerCreateDto } from "../types/Customer";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/customers`;
export async function getCustomers(search?: string): Promise<CustomerListItemDto[]> {
  const url = search ? `${BASE_URL}?search=${encodeURIComponent(search)}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function getCustomerById(id: number): Promise<CustomerDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Customer not found");
  return res.json();
}

export async function createCustomer(dto: CustomerCreateDto): Promise<CustomerDetailDto> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
}

export async function updateCustomer(id: number, dto: CustomerCreateDto): Promise<CustomerDetailDto> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
}

export async function deleteCustomer(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete customer");
}
