import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPackage } from "../../services/packagesApi";
import { PackageCreateDto } from "../../types/Package";
import PackageForm from "./PackageForm";

export default function PackageCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(dto: PackageCreateDto) {
    try {
      setSaving(true);
      await createPackage(dto);
      navigate("/packages");
    } catch (err) {
      console.error("Error creating package:", err);
      alert("Failed to create package");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <PackageForm onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
