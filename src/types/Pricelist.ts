import { CustomerType } from "./Customer";

// Riga pacchetto nel dettaglio del listino
export interface PricelistPackageDto {
  packageId: number;
  packageName: string;
  price: number;
  notes?: string;
}

// Riga pacchetto usata per create/update
export interface PricelistPackageCreateDto {
  packageId: number;
  price: number;
  notes?: string;
}

// DTO elenco
export interface PricelistListItemDto {
  id: number;
  name: string;
  year: number;
  customerType: CustomerType;
  isActive: boolean;
  totalPackages: number;
}

// DTO dettaglio
export interface PricelistDetailDto {
  id: number;
  name: string;
  year: number;
  customerType: CustomerType;
  priceMultiplier?: number;
  isActive: boolean;
  packages: PricelistPackageDto[];
}

// DTO create/update
export interface PricelistCreateDto {
  name: string;
  year: number;
  customerType: CustomerType;
  priceMultiplier?: number;
  isActive: boolean;
  packages: PricelistPackageCreateDto[];
}

export type PricelistUpdateDto = PricelistCreateDto;

// ---- (Opzionale) Interfaccia di stato UI per la tabella pacchetti nel form
export interface PricelistPackageRow {
  packageId: number;
  packageName: string;
  defaultPrice: number;
  included: boolean;
  price: number;       // prezzo nel listino (se incluso)
}
