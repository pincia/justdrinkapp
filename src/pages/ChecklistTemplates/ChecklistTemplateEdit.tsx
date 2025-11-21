// src/pages/ChecklistTemplates/ChecklistTemplateEdit.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChecklistTemplateForm from "./ChecklistTemplateForm";
import {
  ChecklistTemplateCreateDto,
  ChecklistTemplateDto,
} from "../../types/Checklist";
import {
  getChecklistTemplateById,
  updateChecklistTemplate,
} from "../../services/checklistTemplatesApi";

export default function ChecklistTemplateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<ChecklistTemplateDto | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getChecklistTemplateById(Number(id))
      .then(setTemplate)
      .catch(() => alert("Impossibile caricare il template"));
  }, [id]);

  async function handleSubmit(dto: ChecklistTemplateCreateDto) {
    if (!id) return;
    setSaving(true);
    try {
      await updateChecklistTemplate(Number(id), dto);
      navigate("/checklist-templates");
    } finally {
      setSaving(false);
    }
  }

  if (!template) return <div className="p-6">Caricamento...</div>;

  return (
    <div className="p-6">
      <ChecklistTemplateForm
        initialData={template}
        onSubmit={handleSubmit}
        submitting={saving}
      />
    </div>
  );
}
