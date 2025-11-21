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
export type EventType = "Matrimonio" | "Privato" | "Aziendale" | "MixologyExperience" | "Pubblico";
// === DTOs BASE ===

export interface OfferListItem {
  id: number;
  code: string;
  customerName: string;
  eventTypeName?: string;
  status: OfferStatus;
  totalAmount: number;
  expirationDate?: string;
  createdAt: string;
  eventDate?: string;
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
  plannerId?: number;
  plannerName?: string;
  items: OfferItemDetail[];
  paymentTerms: OfferPaymentTerm[];
  attachments?: OfferAttachmentDto[];
}

// === CREATE ===
export interface OfferCreateDto {
  customerId: number;
  eventId?: number;
  pricelistId?: number;

  locationId?: number;
  eventDate?: string;
  eventType: EventType;

  discountType: DiscountType;
  discountValue: number;
  notes?: string;
  expirationDate?: string;
  plannerId?: number;
  items: OfferItemCreateDto[];
  paymentTerms: OfferPaymentTermCreateDto[];
}

// Estendi l'interfaccia aggiungendo optional name-fields
export interface OfferCreateDto {
  customerName?: string;
  plannerName?: string;
  pricelistName?: string;
  locationName?: string;
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
