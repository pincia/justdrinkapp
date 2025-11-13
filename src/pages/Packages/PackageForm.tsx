import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Select from "../../components/form/Select";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import { PackageCreateDto, PackageDetailDto } from "../../types/Package";

type Props = {
  initialData?: PackageDetailDto;
  onSubmit?: (data: PackageCreateDto) => Promise<void> | void;
  submitting?: boolean;
  readOnly?: boolean;
};

const defaultData: PackageCreateDto = {
  name: "",
  category: "Standard",
  description: "",
  defaultPrice: 0,
  priceType: "Flat",
  isActive: true,
};

export default function PackageForm({ initialData, onSubmit, submitting, readOnly }: Props) {
  const isReadOnly = !!readOnly;
  const [form, setForm] = useState<PackageCreateDto>(defaultData);

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...rest } = initialData;
      setForm({ ...defaultData, ...rest });
    } else {
      setForm(defaultData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "defaultPrice" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !onSubmit) return;
    await onSubmit(form);
  };

  return (
    <ComponentCard title={isReadOnly ? "Package Details" : "Package Information"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} disabled={isReadOnly} />
          </div>

          <div>
            <Label>Category</Label>
            {isReadOnly ? (
              <Input value={form.category} disabled />
            ) : (
              <Select
                options={[
                  { value: "Standard", label: "Standard" },
                  { value: "Premium", label: "Premium" },
                  { value: "Extra", label: "Extra" },
                  { value: "Custom", label: "Custom" },
                ]}
                placeholder="Select category"
                onChange={(v) => setForm({ ...form, category: v as any })}
              />
            )}
          </div>

          <div>
            <Label>Price Type</Label>
            {isReadOnly ? (
              <Input value={form.priceType} disabled />
            ) : (
              <Select
                options={[
                  { value: "Flat", label: "Flat (forfait)" },
                  { value: "PerPerson", label: "Per Person" },
                ]}
                placeholder="Select type"
                onChange={(v) => setForm({ ...form, priceType: v as any })}
              />
            )}
          </div>

          <div>
            <Label>Default Price (€)</Label>
            <Input
              name="defaultPrice"
              type="number"
              value={form.defaultPrice}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <TextArea
              value={form.description || ""}
              onChange={(v) => !isReadOnly && setForm({ ...form, description: v })}
              placeholder="Description of the package..."
              rows={4}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Switch
              label="Active"
              defaultChecked={form.isActive}
              onChange={(checked) => setForm({ ...form, isActive: checked })}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button variant="primary" disabled={!!submitting}>
              {submitting ? "Saving..." : "Save Package"}
            </Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
