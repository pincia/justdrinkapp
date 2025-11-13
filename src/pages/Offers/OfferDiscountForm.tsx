import { useState } from "react";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

type Props = {
  discountType: string;
  discountValue: number;
  onChange: (type: string, value: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function OfferDiscountForm({
  discountType,
  discountValue,
  onChange,
  onNext,
  onBack,
}: Props) {
  const [type, setType] = useState(discountType);
  const [value, setValue] = useState(discountValue);

  return (
    <ComponentCard title="3️⃣ Sconti e Promozioni">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Tipo di sconto</Label>
          <Select
            options={[
              { value: "None", label: "Nessuno" },
              { value: "Percent", label: "Percentuale (%)" },
              { value: "Fixed", label: "Importo fisso (€)" },
            ]}
            placeholder="Seleziona tipo"
            onChange={(val) => setType(val)}
          />
        </div>

        {type !== "None" && (
          <div>
            <Label>Valore sconto</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Indietro
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onChange(type, value);
            onNext();
          }}
        >
          Avanti
        </Button>
      </div>
    </ComponentCard>
  );
}
