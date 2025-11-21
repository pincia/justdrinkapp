import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import TextArea from "../../../components/form/input/TextArea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CustomerListItemDto } from "../../../types/Customer";
import { PlannerListItemDto } from "../../../types/Planner";
import {
  PricelistListItemDto,
  PricelistDetailDto,
} from "../../../types/Pricelist";
import { LocationListItemDto } from "../../../types/Location";
import { OfferCreateDto, DiscountType } from "../../../types/Offer";

type Props = {
  form: OfferCreateDto;
  setForm: (data: OfferCreateDto) => void;
  isReadOnly: boolean;
  customers: CustomerListItemDto[];
  planners: PlannerListItemDto[];
  pricelists: PricelistListItemDto[];
  locations: LocationListItemDto[];
  activePricelist: PricelistDetailDto | null;
  handlePricelistChange: (id: number) => void;
};

// --- helpers per gestire date in locale (YYYY-MM-DD) ---
function formatDateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateLocal(value?: string | null): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // <-- data locale, niente UTC
}

export default function OfferFormHeader({
  form,
  setForm,
  isReadOnly,
  customers,
  planners,
  pricelists,
  locations,
  activePricelist,
  handlePricelistChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Cliente */}
      <div>
        <Label>Cliente</Label>
        {isReadOnly ? (
          <Input value={form.customerName ?? "-"} disabled />
        ) : (
          <Select
            value={form.customerId ? String(form.customerId) : ""}
            options={customers.map((c) => ({
              value: String(c.id),
              label: `${c.firstName} ${c.lastName}`,
            }))}
            placeholder="Seleziona cliente"
            onChange={(v) => setForm({ ...form, customerId: Number(v) })}
          />
        )}
      </div>

      {/* Planner */}
      <div>
        <Label>Wedding Planner / Organizer</Label>
        {isReadOnly ? (
          <Input value={form.plannerName ?? "-"} disabled />
        ) : (
          <Select
            value={form.plannerId ? String(form.plannerId) : ""}
            options={[
              { value: "", label: "Nessuno" },
              ...planners.map((p) => ({
                value: String(p.id),
                label:
                  p.fullName +
                  (p.companyName ? ` (${p.companyName})` : ""),
              })),
            ]}
            placeholder="Seleziona planner"
            onChange={(v) =>
              setForm({ ...form, plannerId: v ? Number(v) : undefined })
            }
          />
        )}
      </div>

      {/* Listino */}
      <div>
        <Label>Listino Prezzi</Label>
        {isReadOnly ? (
          <Input value={activePricelist?.name || "-"} disabled />
        ) : (
          <Select
            value={form.pricelistId ? String(form.pricelistId) : ""}
            options={pricelists.map((pl) => ({
              value: String(pl.id),
              label: `${pl.name} (${pl.year})`,
            }))}
            placeholder="Seleziona listino"
            onChange={(v) => handlePricelistChange(Number(v))}
          />
        )}
      </div>

      {/* Data Evento */}
      <div>
        <Label>Data Evento</Label>
        {isReadOnly ? (
          <Input value={form.eventDate || "-"} disabled />
        ) : (
          <DatePicker
            selected={parseDateLocal(form.eventDate)}
            onChange={(date) =>
              setForm({
                ...form,
                eventDate: date ? formatDateLocal(date) : "",
              })
            }
            dateFormat="dd-MM-yyyy"
            className="h-11 w-full rounded-lg border px-4 py-2.5"
            placeholderText="Seleziona data evento"
          />
        )}
      </div>

      {/* Tipo Evento */}
      <div>
        <Label>Tipo Evento</Label>
        {isReadOnly ? (
          <Input value={form.eventType} disabled />
        ) : (
          <Select
            value={form.eventType}
            options={[
              { value: "Matrimonio", label: "Matrimonio" },
              { value: "Privato", label: "Festa privata" },
              { value: "Aziendale", label: "Evento aziendale" },
              { value: "Pubblico", label: "Evento Pubblic" },
            ]}
            onChange={(v) => setForm({ ...form, eventType: v as any })}
          />
        )}
      </div>

      {/* Location */}
      <div>
        <Label>Location</Label>
        {isReadOnly ? (
          <Input value={form.locationName ?? "-"} disabled />
        ) : (
          <Select
            value={form.locationId ? String(form.locationId) : ""}
            options={locations.map((l) => ({
              value: String(l.id),
              label: l.name,
            }))}
            placeholder="Seleziona location"
            onChange={(v) => setForm({ ...form, locationId: Number(v) })}
          />
        )}
      </div>

      {/* Scadenza */}
      <div>
        <Label>Data Scadenza</Label>
        {isReadOnly ? (
          <Input value={form.expirationDate || "-"} disabled />
        ) : (
          <DatePicker
            selected={parseDateLocal(form.expirationDate)}
            onChange={(date) =>
              setForm({
                ...form,
                expirationDate: date ? formatDateLocal(date) : "",
              })
            }
            dateFormat="dd-MM-yyyy"
            className="h-11 w-full rounded-lg border px-4 py-2.5"
            placeholderText="Seleziona scadenza"
          />
        )}
      </div>

      {/* Tipo Sconto */}
      <div>
        <Label>Tipo di Sconto</Label>
        {isReadOnly ? (
          <Input value={form.discountType} disabled />
        ) : (
          <Select
            value={form.discountType}
            options={[
              { value: "None", label: "Nessuno" },
              { value: "Percent", label: "Percentuale (%)" },
              { value: "Fixed", label: "Importo fisso (€)" },
            ]}
            onChange={(v) =>
              setForm({ ...form, discountType: v as DiscountType })
            }
          />
        )}
      </div>

      {/* Valore sconto */}
      {form.discountType !== "None" && (
        <div>
          <Label>Valore dello Sconto</Label>
          <Input
            type="number"
            value={form.discountValue}
            onChange={(e) =>
              setForm({ ...form, discountValue: Number(e.target.value) })
            }
            disabled={isReadOnly}
          />
        </div>
      )}

      {/* Note */}
      <div className="md:col-span-2">
        <Label>Note</Label>
        <TextArea
          value={form.notes}
          onChange={(v) => setForm({ ...form, notes: v })}
          disabled={isReadOnly}
          rows={4}
          placeholder="Note aggiuntive..."
        />
      </div>
    </div>
  );
}
