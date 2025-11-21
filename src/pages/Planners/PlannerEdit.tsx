import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PlannerDetailDto, PlannerUpdateDto } from "../../types/Planner";
import { getPlannerById, updatePlanner } from "../../services/plannersApi";

import PlannerForm from "./PlannerForm";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function PlannerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<PlannerDetailDto | null>(null);
  const [, setSaving] = useState(false);

  useEffect(() => {
    getPlannerById(Number(id)).then(setData);
  }, [id]);

  async function handleSubmit(dto: PlannerUpdateDto) {
    try {
      setSaving(true);
      await updatePlanner(Number(id), dto);
      navigate("/planners");
    } catch (err) {
      console.error("❌ Errore aggiornamento planner:", err);
      alert("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Modifica Planner" description="Modifica planner" />
      <PageBreadcrumb pageTitle="Modifica Planner" />

      <PlannerForm
        initialData={data}
        onSubmit={handleSubmit}
        readOnly={false}
      />
    </div>
  );
}
