import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOfferById, updateOfferStatus } from "../../services/offersApi";
import { OfferDetail, OfferStatus } from "../../types/Offer";
import ComponentCard from "../../components/common/ComponentCard";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { PencilIcon } from "lucide-react";
import OfferForm from "./OfferForm";
import Select from "../../components/form/Select";
import { useSnackbar } from "../../context/SnackbarContext";;

const statusOptions: { value: OfferStatus; label: string }[] = [
  { value: "Draft", label: "Bozza" },
  { value: "Sent", label: "Inviato" },
  { value: "Accepted", label: "Accettato" },
  { value: "Rejected", label: "Rifiutato" },
  { value: "Expired", label: "Scaduto" },
  { value: "Cancelled", label: "Annullato" },
];

const statusColorMap: Record<OfferStatus, "primary" | "success" | "warning" | "error" | "dark"> = {
  Draft: "primary",
  Sent: "primary",
  Accepted: "success",
  Rejected: "error",
  Expired: "warning",
  Cancelled: "dark",
};

export default function OfferView() {
  const { id } = useParams();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [status, setStatus] = useState<OfferStatus | "">("");
  const [savingStatus, setSavingStatus] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function load() {
      try {
        const data = await getOfferById(Number(id));
        setOffer(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
        alert("Preventivo non trovato");
      }
    }
    if (id) load();
  }, [id]);

  if (!offer) return <div className="p-6 text-gray-500">Caricamento…</div>;

  async function handleStatusSave() {
    if (!id || !status) return;
    try {
      setSavingStatus(true);
      await updateOfferStatus(Number(id), status);
      setOffer((prev) => (prev ? { ...prev, status } : prev));
      showSnackbar("Stato aggiornato correttamente!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Errore aggiornamento stato", "error");
    } finally {
      setSavingStatus(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Pulsante Modifica */}
      <div className="flex justify-end">
        <Link to={`/offers/${offer.id}/edit`}>
          <Button
            variant="outline"
            startIcon={<PencilIcon className="size-4" />}
          >
            Modifica
          </Button>
        </Link>
      </div>

      {/* Stato & info sintetiche */}
      <ComponentCard title={`Preventivo`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p>
              <strong>Cliente:</strong> {offer.customerName}
            </p>
            <p>
              <strong>Evento:</strong> {offer.eventName || "-"}
            </p>
            <p>
              <strong>Totale:</strong> € {offer.totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Scadenza:</strong>{" "}
              {offer.expirationDate
                ? new Date(offer.expirationDate).toLocaleDateString("it-IT")
                : "-"}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-gray-500">Stato attuale</span>
            <Badge
              color={statusColorMap[offer.status] ?? "primary"}
              variant="light"
            >
              {offer.status}
            </Badge>
          </div>
        </div>
      </ComponentCard>

      {/* Form dettagliato in sola lettura */}
      <OfferForm initialData={offer} readOnly onSubmit={() => {}} />

      {/* Blocco cambio stato manuale */}
      <ComponentCard title="Cambia stato preventivo">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <Select
              value={status || undefined}
              options={statusOptions.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
              onChange={(v) => setStatus(v as OfferStatus)}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleStatusSave}
            disabled={savingStatus || !status}
          >
            {savingStatus ? "Salvataggio..." : "Aggiorna stato"}
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
}
