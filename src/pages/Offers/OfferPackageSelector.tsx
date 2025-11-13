import { useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import ComponentCard from "../../components/common/ComponentCard";

type Props = {
  discountType: string;
  discountValue: number;
  onChange: (type: string, value: number) => void;
};

export default function OfferDiscountForm({ discountType, discountValue, onChange }: Props) {
  const [type, setType] = useState(discountType);
  const [value, setValue] = useState(discountValue);

  const handleChange = (t: string, v: number) => {
    setType(t);
    setValue(v);
    onChange(t, v);
  };

  return (
    <ComponentCard title="Sconti e Promozioni">
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
            onChange={(val) => handleChange(val, value)}
          />
        </div>

        {type !== "None" && (
          <div>
            <Label>Valore</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => handleChange(type, Number(e.target.value))}
              placeholder={type === "Percent" ? "% sconto" : "€ importo"}
            />
          </div>
        )}
      </div>
    </ComponentCard>
  );
}
