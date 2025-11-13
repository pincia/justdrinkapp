import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PricelistForm from "./PricelistForm";
import { PricelistDetailDto } from "../../types/Pricelist";
import { getPricelistById } from "../../services/pricelistsApi";
import Button from "../../components/ui/button/Button";
import { PencilIcon } from "lucide-react";

export default function PricelistDetail() {
  const { id } = useParams();
  const [pricelist, setPricelist] = useState<PricelistDetailDto | null>(null);

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

  if (!pricelist) return <div className="p-6 text-gray-500">Caricamento…</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <Link to={`/pricelists/${pricelist.id}/edit`}>
          <Button variant="outline" startIcon={<PencilIcon className="size-4" />}>
            Modifica
          </Button>
        </Link>
      </div>

      <PricelistForm
        initialData={pricelist}
        readOnly
        onSubmit={() => {}}
      />
    </div>
  );
}
