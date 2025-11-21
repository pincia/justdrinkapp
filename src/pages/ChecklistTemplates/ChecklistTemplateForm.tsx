// src/pages/ChecklistTemplates/ChecklistTemplateForm.tsx
import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";

import {
  ChecklistTemplateCreateDto,
  ChecklistTemplateDto,
  ChecklistItemPriority,
} from "../../types/Checklist";

type Props = {
  initialData?: ChecklistTemplateDto;
  onSubmit?: (data: ChecklistTemplateCreateDto) => Promise<void> | void;
  submitting?: boolean;
  readOnly?: boolean;
};

const defaultData: ChecklistTemplateCreateDto = {
  title: "",
  description: "",
  priority: ChecklistItemPriority.Medium,
  isActive: true,
  eventType: null,
};

export default function ChecklistTemplateForm({
  initialData,
  onSubmit,
  submitting,
  readOnly,
}: Props) {
  const [form, setForm] = useState<ChecklistTemplateCreateDto>(defaultData);
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

  const handlePriorityChange = (value: string) => {
    if (isReadOnly) return;
    setForm((prev) => ({
      ...prev,
      priority: Number(value) as ChecklistItemPriority,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !onSubmit) return;
    await onSubmit(form);
  };

  return (
    <ComponentCard
      title={isReadOnly ? "Dettaglio Template Checklist" : "Template Checklist"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Titolo */}
          <div>
            <Label>Titolo</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Es. Sopralluogo location"
            />
          </div>

          {/* Priorità */}
          <div>
            <Label>Priorità</Label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              disabled={isReadOnly}
            >
              <option value={ChecklistItemPriority.High}>Alta 🔥</option>
              <option value={ChecklistItemPriority.Medium}>Media ⭐</option>
              <option value={ChecklistItemPriority.Low}>Bassa •</option>
            </select>
          </div>

          {/* Tipo Evento (opzionale) 
          <div>
            <Label>Tipo Evento (opzionale)</Label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.eventType ?? ""}
              disabled={isReadOnly}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  eventType: e.target.value === "" ? null : Number(e.target.value),
                }))
              }
            >
              <option value="">Tutti i tipi di evento</option>
              <option value={EventType.Wedding}>Matrimonio 💍</option>
              <option value={EventType.Corporate}>Corporate 🏢</option>
              <option value={EventType.PrivateParty}>Festa privata 🎉</option>
              <option value={EventType.Other}>Altro ✨</option>
            </select>
          </div>*/}

          {/* Attivo */}
          <div className="flex items-center gap-4 mt-2">
            <Switch
              label="Attivo"
              defaultChecked={form.isActive}
              onChange={(checked) =>
                !isReadOnly &&
                setForm((prev) => ({ ...prev, isActive: checked }))
              }
              disabled={isReadOnly}
            />
          </div>

          {/* Descrizione */}
          <div className="md:col-span-2">
            <Label>Descrizione</Label>
            <TextArea
              value={form.description || ""}
              onChange={(v) =>
                !isReadOnly &&
                setForm((prev) => ({
                  ...prev,
                  description: v,
                }))
              }
              rows={4}
              placeholder="Dettagli operativi del task..."
              disabled={isReadOnly}
            />
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button variant="primary" disabled={!!submitting}>
              {submitting ? "Salvataggio..." : "Salva Template"}
            </Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
