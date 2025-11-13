import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOffer } from "../../services/offersApi";
import { OfferCreateDto } from "../../types/Offer";
import OfferForm from "./OfferForm";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function OfferCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(dto: OfferCreateDto) {
    try {
      setSaving(true);
      await createOffer(dto);
      navigate("/offers");
    } catch (err) {
      console.error("Errore nella creazione del preventivo:", err);
      alert("Creazione preventivo fallita");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Nuovo Preventivo" description="Crea un nuovo preventivo" />
      <PageBreadcrumb pageTitle="Nuovo Preventivo" />
      <OfferForm onSubmit={handleSubmit} submitting={saving} />
    </div>
 
  );
}
