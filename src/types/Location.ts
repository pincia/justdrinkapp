export interface LocationListItemDto {
  id: number;
  name: string;
  city?: string;
  province?: string;
  isActive: boolean;
}

export interface LocationDetailDto {
  id: number;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface LocationCreateDto {
  name: string;
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export type LocationUpdateDto = LocationCreateDto;
