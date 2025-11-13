import { OfferCreateDto } from "../../types/Offer";
import { PackageListItemDto } from "../../types/Package";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";

type Props = {
  form: OfferCreateDto;
  packages: PackageListItemDto[];
  onBack: () => void;
  onSave: () => void;
};

export default function OfferSummaryCard({ form, packages, onBack, onSave }: Props) {
  const subtotal = form.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discount =
    form.discountType === "Percent"
      ? (subtotal * form.discountValue) / 100
      : form.discountType === "Fixed"
      ? form.discountValue
      : 0;
  const total = subtotal - discount;

  return (
    <ComponentCard title="5️⃣ Riepilogo Offerta">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pacchetti</h3>
        <ul className="divide-y divide-gray-200">
          {form.items.map((i, idx) => {
            const p = packages.find((p) => p.id === i.packageId);
            return (
              <li key={idx} className="py-2 flex justify-between">
                <span>{p?.name}</span>
                <span>
                  {i.quantity} × € {i.unitPrice.toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="border-t pt-3">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Subtotale</span>
            <span>€ {subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-gray-700">
              <span>Sconto ({form.discountType})</span>
              <span>-€ {discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg mt-2">
            <span>Totale</span>
            <span>€ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Indietro
        </Button>
        <Button variant="primary" onClick={onSave}>
          Salva Offerta
        </Button>
      </div>
    </ComponentCard>
  );
}
