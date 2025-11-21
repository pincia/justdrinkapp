// src/pages/ChecklistTemplates/ChecklistTemplateCreate.tsx
import { useNavigate } from "react-router-dom";
import ChecklistTemplateForm from "./ChecklistTemplateForm";
import { ChecklistTemplateCreateDto } from "../../types/Checklist";
import { createChecklistTemplate } from "../../services/checklistTemplatesApi";

export default function ChecklistTemplateCreate() {
  const navigate = useNavigate();

  async function handleSubmit(dto: ChecklistTemplateCreateDto) {
    await createChecklistTemplate(dto);
    navigate("/checklist-templates");
  }

  return (
    <div className="p-6">
      <ChecklistTemplateForm onSubmit={handleSubmit} />
    </div>
  );
}
