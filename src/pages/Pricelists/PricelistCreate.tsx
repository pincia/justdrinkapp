import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PricelistForm from "./PricelistForm";
import { PricelistCreateDto } from "../../types/Pricelist";
import { createPricelist } from "../../services/pricelistsApi";

export default function PricelistCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(dto: PricelistCreateDto) {
    try {
      setSaving(true);
      await createPricelist(dto);
      navigate("/pricelists");
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio del listino");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <PricelistForm onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
