export interface CustomerListItemDto {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  customerType: number;
  taxCodeOrVat?: string;
  isActive: boolean;
}

export interface CustomerDetailDto extends CustomerListItemDto {
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  notes?: string;
}

export interface CustomerCreateDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  customerType: number;
  taxCodeOrVat?: string;
  notes?: string;
  isActive: boolean;
}

export enum CustomerType {
  Private = 0,
  Company = 1,
  Structure = 2,
  WeddingPlanner = 3,
}

export const CustomerTypeLabel: Record<CustomerType, string> = {
  [CustomerType.Private]: "Privato",
  [CustomerType.Company]: "Azienda",
  [CustomerType.Structure]: "Struttura",
  [CustomerType.WeddingPlanner]: "Wedding Planner",
};