export type PaymentMethod = "BankTransfer" | "Card" | "Cash";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "BankTransfer", label: "Bonifico bancario" },
  { value: "Card", label: "Carta" },
  { value: "Cash", label: "Contanti" },
];
