import { useEffect, useState } from "react";
import { PaymentCreateDto, PaymentMethod, PaymentStatus, PaymentDetailDto } from "../../../types/Payment";
import { createPayment, updatePayment } from "../../../services/paymentsApi";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import TextArea from "../../form/input/TextArea";
import Button from "../button/Button";
import ComponentCard from "../../common/ComponentCard";

export default function PaymentFormDialog({
  eventId,
  payment,
  onClose
}: {
  eventId: number;
  payment?: PaymentDetailDto | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PaymentCreateDto>({
    eventId,
    amount: 0,
    method: PaymentMethod.BankTransfer,
    dueDate: new Date().toISOString().substring(0, 10),
    notes: "",
    status: PaymentStatus.ToPay
  });

  useEffect(() => {
    if (payment) {
      setForm({
        eventId,
        amount: payment.amount,
        method: payment.method,
        dueDate: payment.dueDate.substring(0, 10),
        notes: payment.notes || "",
        status: payment.status,
        paidDate: payment.paidDate?.substring(0, 10),
      });
    }
  }, [payment]);

  const handleSubmit = async () => {
    if (payment) {
      await updatePayment(payment.id, eventId, form);
    } else {
      await createPayment(form);
    }
    onClose();
  };

 const markAsPaid = async () => {
  if (!payment) return;

  await updatePayment(payment.id, eventId, {
    ...form,
    status: PaymentStatus.Paid,
    paidDate: new Date().toISOString().substring(0, 10)
  });

  onClose();
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <ComponentCard title={payment ? "Modifica Pagamento" : "Nuovo Pagamento"} className="w-full max-w-lg">
        <div className="space-y-4">
          <div>
            <label>Metodo</label>
            <Select
              value={String(form.method)}
              options={[
                { value: String(PaymentMethod.Cash), label: "Contanti" },
                { value: String(PaymentMethod.BankTransfer), label: "Bonifico" },
                { value: String(PaymentMethod.CreditCard), label: "Carta di Credito" }
              ]}
              onChange={(v) => setForm({ ...form, method: Number(v) })}
            />
          </div>

          <div>
            <label>Importo (€)</label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>

          <div>
            <label>Data Scadenza</label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div>
            <label>Note</label>
            <TextArea
              value={form.notes || ""}
              onChange={(v) => setForm({ ...form, notes: v })}
            />
          </div>
          <div>
            <label>Stato</label>
            <Select
              value={String(form.status)}
              options={[
                { value: String(PaymentStatus.ToPay), label: "Da pagare" },
                { value: String(PaymentStatus.Paid), label: "Pagato" },
                { value: String(PaymentStatus.Overdue), label: "Scaduto" }
              ]}
              onChange={(v) => setForm({ ...form, status: Number(v) })}
            />
          </div>
            {form.status === PaymentStatus.Paid && (
              <div>
                <label>Data Pagamento</label>
                <Input
                  type="date"
                  value={form.paidDate || ""}
                  onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
                />
              </div>
            )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>Annulla</Button>
            {payment && (
              <Button variant="outline" onClick={markAsPaid}>
                Segna come Pagato
              </Button>
            )}
            <Button onClick={handleSubmit}>
              {payment ? "Aggiorna" : "Salva"}
            </Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
