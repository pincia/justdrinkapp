import { useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import ComponentCard from "../../components/common/ComponentCard";
import { OfferPaymentTermCreateDto } from "../../types/Offer";
import Button from "../../components/ui/button/Button";

type Props = {
  terms: OfferPaymentTermCreateDto[];
  onChange: (terms: OfferPaymentTermCreateDto[]) => void;
};

export default function OfferPaymentForm({ terms, onChange }: Props) {
  const [list, setList] = useState<OfferPaymentTermCreateDto[]>(terms.length ? terms : [
    { percentage: 30, paymentMethod: "BankTransfer" },
    { percentage: 70, paymentMethod: "BankTransfer" },
  ]);

  const update = (i: number, f: keyof OfferPaymentTermCreateDto, v: any) => {
    const newList = [...list];
    (newList[i] as any)[f] = v;
    setList(newList);
    onChange(newList);
  };

  const addTerm = () => {
    setList([...list, { percentage: 0, paymentMethod: "BankTransfer" }]);
  };

  return (
    <ComponentCard title="Condizioni di Pagamento">
      <div className="space-y-5">
        {list.map((term, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Percentuale</Label>
              <Input
                type="number"
                value={term.percentage}
                onChange={(e) => update(i, "percentage", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Data Scadenza</Label>
              <Input
                type="date"
                value={term.dueDate ? term.dueDate.substring(0, 10) : ""}
                onChange={(e) => update(i, "dueDate", e.target.value)}
              />
            </div>
            <div>
              <Label>Metodo Pagamento</Label>
              <Select
                options={[
                  { value: "BankTransfer", label: "Bonifico" },
                  { value: "Card", label: "Carta" },
                  { value: "Cash", label: "Contanti" },
                ]}
                placeholder="Seleziona metodo"
                onChange={(val) => update(i, "paymentMethod", val)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={addTerm}>
          + Aggiungi rata
        </Button>
      </div>
    </ComponentCard>
  );
}
