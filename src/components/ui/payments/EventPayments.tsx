import { useEffect, useState } from "react";
import { PaymentDetailDto, PaymentStatus, PaymentMethod } from "../../../types/Payment";
import { getPaymentsByEvent } from "../../../services/paymentsApi";
import Button from "../../ui/button/Button";
import PaymentFormDialog from "./PaymentFormDialog";

export default function EventPayments({ eventId }: { eventId: number }) {
  const [payments, setPayments] = useState<PaymentDetailDto[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentDetailDto | null>(null);

  async function load() {
    const data = await getPaymentsByEvent(eventId);
    setPayments(data);
  }

  useEffect(() => {
    load();
  }, [eventId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pagamenti</h3>
    <Button
  onClick={() => {
    setEditingPayment(null);
    setOpenDialog(true);
  }}
>
          Aggiungi Pagamento
        </Button>
      </div>

      <table className="min-w-full border rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Metodo</th>
            <th className="p-2">Importo</th>
            <th className="p-2">Scadenza</th>
            <th className="p-2">Stato</th>
            <th className="p-2">Pagato il</th>
            <th className="p-2">Note</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{PaymentMethod[p.method]}</td>
              <td className="p-2">€ {p.amount.toFixed(2)}</td>
              <td className="p-2">{p.dueDate.substring(0, 10)}</td>
              <td className="p-2">{PaymentStatus[p.status]}</td>
              <td className="p-2">
                {p.paidDate ? p.paidDate.substring(0, 10) : "-"}
              </td>
              <td className="p-2">{p.notes || "-"}</td>
              <td className="p-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPayment(p);
                    setOpenDialog(true);
                  }}
                >
                  Modifica
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openDialog && (
        <PaymentFormDialog
          eventId={eventId}
          payment={editingPayment}
          onClose={() => {
            setOpenDialog(false);
            setEditingPayment(null);
            load();
          }}
        />
      )}
    </div>
  );
}
