export interface CustomerListItemDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;

  email?: string;
  phone?: string;
  customerType: number;
  isActive: boolean;
}


export interface CustomerDetailDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;

  birthDate?: string;
  birthPlace?: string;

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


export interface CustomerCreateDto {
  firstName: string;
  lastName: string;
  birthDate?: string;
  birthPlace?: string;

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