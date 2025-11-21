import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import { LocationCreateDto, LocationDetailDto } from "../../types/Location";

type Props = {
  initialData?: LocationDetailDto;
  onSubmit?: (data: LocationCreateDto) => Promise<void> | void;
  submitting?: boolean;
  readOnly?: boolean;
};

const defaultData: LocationCreateDto = {
  name: "",
  address: "",
  city: "",
  province: "",
  zipCode: "",
  phone: "",
  email: "",
  isActive: true,
};

export default function LocationForm({ initialData, onSubmit, submitting, readOnly }: Props) {
  const [form, setForm] = useState<LocationCreateDto>(defaultData);
  const isReadOnly = !!readOnly;

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm({ ...defaultData, ...rest });
    } else {
      setForm(defaultData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !onSubmit) return;
    await onSubmit(form);
  };

  return (
    <ComponentCard title={isReadOnly ? "Location Details" : "Location Information"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Nome</Label>
            <Input name="name" value={form.name} onChange={handleChange} disabled={isReadOnly} />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email || ""} onChange={handleChange} disabled={isReadOnly} />
          </div>

          <div>
            <Label>Telefono</Label>
            <Input name="phone" value={form.phone || ""} onChange={handleChange} disabled={isReadOnly} />
          </div>

          <div>
            <Label>Città</Label>
            <Input name="city" value={form.city || ""} onChange={handleChange} disabled={isReadOnly} />
          </div>

          <div>
            <Label>Provincia</Label>
            <Input name="province" value={form.province || ""} onChange={handleChange} disabled={isReadOnly} />
          </div>

          <div>
            <Label>CAP</Label>
            <Input name="zipCode" value={form.zipCode || ""} onChange={handleChange} disabled={isReadOnly} />
          </div>

          <div className="md:col-span-2">
            <Label>Indirizzo</Label>
            <Input name="address" value={form.address || ""} onChange={handleChange} disabled={isReadOnly} />
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
              {submitting ? "Saving..." : "Save Location"}
            </Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
