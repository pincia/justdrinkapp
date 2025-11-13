
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOfferById, updateOffer } from "../../services/offersApi";
import { OfferDetail, OfferCreateDto } from "../../types/Offer";
import OfferForm from "./OfferForm";

export default function OfferEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getOfferById(Number(id)).then(setOffer);
  }, [id]);

  async function handleSubmit(dto: OfferCreateDto) {
    setSaving(true);
    await updateOffer(Number(id), dto);
    setSaving(false);
    navigate("/offers");
  }

  if (!offer) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <OfferForm initialData={offer} onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
