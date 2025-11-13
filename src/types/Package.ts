export type PriceType = "PerPerson" | "Flat";
export type PackageCategory = "Standard" | "Premium" | "Extra" | "Custom";

export interface PackageListItemDto {
  id: number;
  name: string;
  category: PackageCategory;
  description?: string;
  defaultPrice: number;
  priceType: PriceType;
  isActive: boolean;
}

export interface PackageDetailDto extends PackageListItemDto {
  createdAt: string;
  updatedAt?: string;
  includedItems?: string[]; // es. “Barman, bicchieri, setup bar…”
}

export interface PackageCreateDto {
  name: string;
  category: PackageCategory;
  description?: string;
  defaultPrice: number;
  priceType: PriceType;
  isActive: boolean;
}

export interface PackageUpdateDto extends PackageCreateDto {}
