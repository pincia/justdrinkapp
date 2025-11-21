import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PlannerCreateDto } from "../../types/Planner";
import { createPlanner } from "../../services/plannersApi";

import PlannerForm from "./PlannerForm";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

export default function PlannerCreate() {
  const navigate = useNavigate();
  const [, setSaving] = useState(false);

  async function handleSubmit(dto: PlannerCreateDto) {
    try {
      setSaving(true);
      await createPlanner(dto);
      navigate("/planners");
    } catch (err) {
      console.error("❌ Errore nella creazione del planner:", err);
      alert("Errore durante la creazione");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Nuovo Planner" description="Crea un nuovo planner" />
      <PageBreadcrumb pageTitle="Nuovo Planner" />

      <ComponentCard title="Nuovo Planner">
        <PlannerForm onSubmit={handleSubmit} />
      </ComponentCard>
    </div>
  );
}
