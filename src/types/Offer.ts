import { PaymentMethod } from "./Shared";

// === ENUMS ===
export type OfferStatus =
  | "Draft"
  | "Sent"
  | "Accepted"
  | "Rejected"
  | "Expired"
  | "Cancelled";
  
export type DiscountType = "None" | "Percent" | "Fixed";
export type EventType = "Wedding" | "Party" | "Corporate" | "Birthday";
// === DTOs BASE ===

export interface OfferListItem {
  id: number;
  code: string;
  customerName: string;
  eventName?: string;
  status: OfferStatus;
  totalAmount: number;
  expirationDate?: string;
  createdAt: string;
}

// === DETAIL ===
export interface OfferDetail {
  id: number;
  code: string;
  customerId: number;
  customerName: string;

  pricelistId?: number;
  eventId?: number;
  eventName?: string;

  // NEW
  locationId?: number;
  locationName?: string;
  eventDate?: string;
  eventType: EventType;

  status: OfferStatus;
  discountType: DiscountType;
  discountValue: number;
  totalAmount: number;
  notes?: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt?: string;

  items: OfferItemDetail[];
  paymentTerms: OfferPaymentTerm[];
  attachments?: OfferAttachmentDto[];
}

// === CREATE ===
export interface OfferCreateDto {
  customerId: number;
  eventId?: number;
  pricelistId?: number;

  // NEW
  locationId?: number;
  eventDate?: string;
  eventType: EventType;

  discountType: DiscountType;
  discountValue: number;
  notes?: string;
  expirationDate?: string;

  items: OfferItemCreateDto[];
  paymentTerms: OfferPaymentTermCreateDto[];
}

// === ITEMS ===
export interface OfferItemCreateDto {
  packageId: number;
  quantity: number;
  unitPrice: number;
  discountType: DiscountType;
  discountValue: number;
}

export interface OfferItemDetail extends OfferItemCreateDto {
  packageName: string;
  subtotal: number;
}

// === PAGAMENTI ===
export interface OfferPaymentTermCreateDto {
  percentage: number;
  dueDate?: string;
  paymentMethod: PaymentMethod;
}

export interface OfferPaymentTerm extends OfferPaymentTermCreateDto {
  id: number;
  amount: number;
  paid: boolean;
}

// === ALLEGATI ===
export interface OfferAttachmentDto {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}
