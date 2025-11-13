import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPackageById } from "../../services/packagesApi";
import { PackageDetailDto } from "../../types/Package";
import PackageForm from "./PackageForm";

export default function PackageView() {
  const { id } = useParams();
  const [pkg, setPkg] = useState<PackageDetailDto | null>(null);

  useEffect(() => {
    getPackageById(Number(id)).then(setPkg);
  }, [id]);

  if (!pkg) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <PackageForm initialData={pkg} readOnly />
    </div>
  );
}
