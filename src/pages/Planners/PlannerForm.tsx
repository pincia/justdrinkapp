// src/pages/planners/PlannerForm.tsx
import { useState } from "react";
import {
  PlannerDetailDto,
  PlannerCreateDto,
  PlannerUpdateDto,
  PlannerType,
} from "../../types/Planner";

import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";

type Props = {
  initialData?: PlannerDetailDto;
  onSubmit: (dto: PlannerCreateDto | PlannerUpdateDto) => void;
  readOnly?: boolean;
};

export default function PlannerForm({ initialData, onSubmit, readOnly }: Props) {
  const isRead = !!readOnly;

  const [form, setForm] = useState<PlannerCreateDto>({
    firstName: initialData?.firstName ?? "",
    lastName: initialData?.lastName ?? "",
    companyName: initialData?.companyName ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    type: initialData?.type ?? PlannerType.WeddingPlanner,
    notes: initialData?.notes ?? "",
  });

  function handleChange(name: string, value: any) {
    if (isRead) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isRead) onSubmit(form);
  }

  return (
    <ComponentCard title={isRead ? "Dettagli Planner" : "Planner"}>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Nome</Label>
            <Input
              value={form.firstName}
              disabled={isRead}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>

          <div>
            <Label>Cognome</Label>
            <Input
              value={form.lastName}
              disabled={isRead}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>

          <div>
            <Label>Azienda</Label>
            <Input
              value={form.companyName ?? ""}
              disabled={isRead}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email ?? ""}
              disabled={isRead}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <Label>Telefono</Label>
            <Input
              value={form.phone ?? ""}
              disabled={isRead}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              disabled={isRead}
              value={String(form.type)}
              options={[
                { value: String(PlannerType.WeddingPlanner), label: "Wedding Planner" },
                { value: String(PlannerType.Organizer), label: "Organizzatore" },
                { value: String(PlannerType.Other), label: "Altro" },
              ]}
              onChange={(v) => handleChange("type", Number(v))}
            />
          </div>
        </div>

        <div>
          <Label>Note</Label>
          <TextArea
            value={form.notes ?? ""}
            disabled={isRead}
            onChange={(v) => handleChange("notes", v)}
            rows={4}
          />
        </div>

        {!isRead && (
          <div className="flex justify-end">
            <Button variant="primary">Salva</Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
