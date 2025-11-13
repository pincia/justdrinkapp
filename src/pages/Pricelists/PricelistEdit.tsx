import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PricelistForm from "./PricelistForm";
import { PricelistCreateDto, PricelistDetailDto } from "../../types/Pricelist";
import { getPricelistById, updatePricelist } from "../../services/pricelistsApi";

export default function PricelistEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pricelist, setPricelist] = useState<PricelistDetailDto | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPricelistById(Number(id));
        setPricelist(data);
      } catch (err) {
        console.error(err);
        alert("Listino non trovato");
      }
    }
    load();
  }, [id]);

  async function handleSubmit(dto: PricelistCreateDto) {
    try {
      setSaving(true);
      await updatePricelist(Number(id), dto);
      navigate("/pricelists");
    } catch (err) {
      console.error(err);
      alert("Errore nell'aggiornamento del listino");
    } finally {
      setSaving(false);
    }
  }

  if (!pricelist) return <div className="p-6 text-gray-500">Caricamento…</div>;

  return (
    <div className="p-6">
      <PricelistForm
        initialData={pricelist}
        onSubmit={handleSubmit}
        submitting={saving}
      />
    </div>
  );
}
