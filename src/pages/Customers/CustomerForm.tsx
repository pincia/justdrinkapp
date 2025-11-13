import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import { CustomerCreateDto, CustomerDetailDto } from "../../types/Customer";

type Props = {
  initialData?: CustomerDetailDto;
  onSubmit?: (data: CustomerCreateDto) => Promise<void> | void; // opzionale in readOnly
  submitting?: boolean;
  readOnly?: boolean; // 👈 nuova prop
};

const defaultData: CustomerCreateDto = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  zipCode: "",
  customerType: 0,
  taxCodeOrVat: "",
  notes: "",
  isActive: true,
};

export default function CustomerForm({
  initialData,
  onSubmit,
  submitting,
  readOnly,
}: Props) {
  const [form, setForm] = useState<CustomerCreateDto>(defaultData);
  const isReadOnly = !!readOnly;

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm({ ...defaultData, ...rest });
    } else {
      setForm(defaultData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (isReadOnly) return; // blocca modifiche in readOnly

    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
  setForm(prev => ({
  ...prev,
  [name]: e.target instanceof HTMLInputElement
    ? (e.target.type === "checkbox" ? e.target.checked : e.target.value)
    : e.target.value
}));

    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return; // niente submit in readOnly
    if (!onSubmit) return;
    await onSubmit(form);
  };

  return (
    <ComponentCard
      title={isReadOnly ? "Customer Details" : "Customer Information"}
    >
      <form
        onSubmit={handleSubmit}
        className={`space-y-6 ${isReadOnly ? "aria-readonly" : ""}`}
        aria-readonly={isReadOnly}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Mario Rossi"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="mario@example.com"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="+39 ..."
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Tax Code / VAT</Label>
            <Input
              name="taxCodeOrVat"
              value={form.taxCodeOrVat || ""}
              onChange={handleChange}
              placeholder="CF o P.IVA"
              disabled={isReadOnly}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Address</Label>
            <Input
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Via Roma 10"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>City</Label>
            <Input
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              placeholder="Firenze"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Province</Label>
            <Input
              name="province"
              value={form.province || ""}
              onChange={handleChange}
              placeholder="FI"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>ZIP Code</Label>
            <Input
              name="zipCode"
              value={form.zipCode || ""}
              onChange={handleChange}
              placeholder="50100"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Customer Type</Label>
            <Select
              // Assicurati che il tuo <Select> supporti value/disabled
              value={String(form.customerType)}
              options={[
                { value: "0", label: "Private" },
                { value: "1", label: "Company" },
                { value: "2", label: "Other" },
              ]}
              placeholder="Select type"
              onChange={(value) =>
                !isReadOnly &&
                setForm((prev) => ({ ...prev, customerType: Number(value) }))
              }
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <TextArea
            value={form.notes || ""}
            onChange={(value) =>
              !isReadOnly && setForm((prev) => ({ ...prev, notes: value }))
            }
            placeholder="Optional notes..."
            rows={5}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Switch
            label="Active"
            // meglio controllata, non defaultChecked
            checked={!!form.isActive}
            onChange={(checked) =>
              !isReadOnly && setForm((prev) => ({ ...prev, isActive: checked }))
            }
            disabled={isReadOnly}
          />
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button variant="primary" disabled={!!submitting}>
              {submitting ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
