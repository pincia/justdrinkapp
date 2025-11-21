// src/pages/planners/PlannerDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PlannerDetailDto } from "../../types/Planner";
import { getPlannerById } from "../../services/plannersApi";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PlannerForm from "./PlannerForm";

export default function PlannerDetail() {
  const { id } = useParams();
  const [data, setData] = useState<PlannerDetailDto | null>(null);

  useEffect(() => {
    getPlannerById(Number(id)).then(setData);
  }, [id]);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Planner" description={""} />
      <PageBreadcrumb pageTitle="Planner" />
      <PlannerForm initialData={data} readOnly onSubmit={() => {}} />
    </div>
  );
}
