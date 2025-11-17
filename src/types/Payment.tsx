export enum PaymentMethod {
  Cash = 0,
  BankTransfer = 1,
  CreditCard = 2,
}

export enum PaymentStatus {
  ToPay = 0,
  Paid = 1,
  Overdue = 2,
}

export interface PaymentDetailDto {
  id: number;
  eventId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  notes?: string;
  paidDate?: string | null;
}


export interface PaymentCreateDto {
  eventId: number;
  method: PaymentMethod;
  amount: number;
  dueDate: string;
  notes?: string | null;
  status: PaymentStatus;
  paidDate?: string | null;
}

