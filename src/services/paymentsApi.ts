import { PaymentCreateDto, PaymentDetailDto, PaymentMethod, PaymentStatus } from "../types/Payment";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE}/events`;

export async function getPaymentsByEvent(eventId: number): Promise<PaymentDetailDto[]> {
  const res = await fetch(`${BASE_URL}/${eventId}/payments`);
  const data = await res.json();

  return data.map((p: any) => ({
    ...p,
    method: PaymentMethod[p.method as keyof typeof PaymentMethod],
    status: PaymentStatus[p.status as keyof typeof PaymentStatus]
  }));
}

export async function createPayment(dto: PaymentCreateDto): Promise<PaymentDetailDto> {
  const payload = {
    amount: dto.amount,
    method: PaymentMethod[dto.method],   // enum → string
    status: PaymentStatus[dto.status],   // enum → string
    dueDate: dto.dueDate,
    paidDate: dto.paidDate,
    notes: dto.notes
  };

  const res = await fetch(`${BASE_URL}/${dto.eventId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}


export async function updatePayment(
  id: number,
  eventId: number,
  dto: PaymentCreateDto
): Promise<PaymentDetailDto> {

  const payload = {
    amount: dto.amount,
    method: PaymentMethod[dto.method],
    status: PaymentStatus[dto.status],
    dueDate: dto.dueDate,
    paidDate: dto.paidDate,
    notes: dto.notes
  };

  const res = await fetch(`${BASE_URL}/${eventId}/payments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function deletePayment(id: number): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res.ok;
}
