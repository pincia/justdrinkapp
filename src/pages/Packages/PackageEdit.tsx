import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPackageById, updatePackage } from "../../services/packagesApi";
import { PackageDetailDto, PackageCreateDto } from "../../types/Package";
import PackageForm from "./PackageForm";

export default function PackageEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<PackageDetailDto | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPackageById(Number(id)).then(setPkg);
  }, [id]);

  async function handleSubmit(dto: PackageCreateDto) {
    setSaving(true);
    await updatePackage(Number(id), dto);
    setSaving(false);
    navigate("/packages");
  }

  if (!pkg) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <PackageForm initialData={pkg} onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
