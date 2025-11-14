import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import Switch from "../../components/form/switch/Switch";

import {
  OfferCreateDto,
  OfferDetail,
  DiscountType,
  OfferItemCreateDto,
  OfferPaymentTermCreateDto,
} from "../../types/Offer";

import { CustomerListItemDto } from "../../types/Customer";
import { PackageListItemDto } from "../../types/Package";
import { PricelistDetailDto, PricelistListItemDto } from "../../types/Pricelist";

import { getCustomers } from "../../services/customersApi";
import { getPackages } from "../../services/packagesApi";
import { getPricelists, getPricelistById } from "../../services/pricelistsApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LocationListItemDto } from "../../types/Location";
import { getLocations } from "../../services/locationsApi";

type Props = {
  initialData?: OfferDetail;
  onSubmit?: (data: OfferCreateDto) => Promise<void> | void;
  submitting?: boolean;
  readOnly?: boolean;
};

const defaultData: OfferCreateDto = {
  customerId: 0,
  pricelistId: undefined,
  discountType: "None",
  discountValue: 0,
  notes: "",
   eventType: "Wedding",
  locationId: undefined,  
  expirationDate: "",
  eventDate: "",
  items: [],
  paymentTerms: [],
};

export default function OfferForm({
  initialData,
  onSubmit,
  submitting,
  readOnly,
}: Props) {
  const isReadOnly = !!readOnly;
  const [locations, setLocations] = useState<LocationListItemDto[]>([]);
  const [form, setForm] = useState<OfferCreateDto>(defaultData);
  const [customers, setCustomers] = useState<CustomerListItemDto[]>([]);
  const [packages, setPackages] = useState<PackageListItemDto[]>([]);
const [pricelists, setPricelists] = useState<PricelistListItemDto[]>([]);

  const [activePricelist, setActivePricelist] =
    useState<PricelistDetailDto | null>(null);

  // ========================= LOAD DROPDOWNS =========================
  useEffect(() => {
    (async () => {
      try {
        const [cust, pack, pl, loc] = await Promise.all([
          getCustomers(),
          getPackages(),
          getPricelists(),
         getLocations(),
        ]);
        setLocations(loc);
        setCustomers(cust);
        setPackages(pack);
        setPricelists(pl);
      } catch (err) {
        console.error("❌ Errore nel caricamento iniziale Dropdown:", err);
      }
    })();
  }, []);

  // ========================= MAPPATURA initialData =========================
 useEffect(() => {
  if (!initialData) return; // non resettare il form!

  console.log("🟦 [MAP] initialData cambiata, preparo mapping...");

  const items: OfferItemCreateDto[] =
    initialData.items?.map(i => ({
      packageId: i.packageId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountType: i.discountType as DiscountType,
      discountValue: i.discountValue,
    })) ?? [];

  const terms: OfferPaymentTermCreateDto[] =
    initialData.paymentTerms?.map(t => ({
      percentage: t.percentage,
      dueDate: t.dueDate,
      paymentMethod: t.paymentMethod,
    })) ?? [];

  setForm({
    customerId: initialData.customerId,
    eventId: initialData.eventId,
    discountType: initialData.discountType as DiscountType,
    discountValue: initialData.discountValue,
    notes: initialData.notes,
    expirationDate: initialData.expirationDate
      ? initialData.expirationDate.substring(0, 10)
      : "",
    items,
    eventDate: initialData.eventDate
    ? initialData.eventDate.substring(0, 10)
    : "",
    paymentTerms: terms,
    pricelistId: initialData.pricelistId,
      locationId: initialData.locationId,
    eventType: initialData.eventType || "Wedding"
  });
}, [initialData]);


  // ========================= SET ACTIVE PRICELIST =========================
  useEffect(() => {
    if (form.pricelistId && pricelists.length > 0) {
       /* const pl = pricelists.find((p) => p.id === form.pricelistId);
    if (pl) {
        setActivePricelist(pl);
      }*/
    }
  }, [form.pricelistId, pricelists]);

  // ========================= CAMBIO LISTINO =========================
  const handlePricelistChange = async (id: number) => {
    if (isReadOnly) return;

    setForm((prev) => ({ ...prev, pricelistId: id }));

    try {
      const pl = await getPricelistById(id);

      setActivePricelist(pl);

      setPackages((prev) =>
        prev.map((p) => {
          const found = pl.packages.find((x) => x.packageId === p.id);
          return { ...p, defaultPrice: found ? found.price : p.defaultPrice };
        })
      );
    } catch (err) {
      console.error("❌ Errore cambio listino:", err);
    }
  };

  // ========================= HANDLERS BASE =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isReadOnly) return;

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "discountValue" ? Number(value) : value,
    }));
  };

  const handleDiscountTypeChange = (value: string) => {
    if (isReadOnly) return;
    setForm((prev) => ({ ...prev, discountType: value as DiscountType }));
  };

  // ========================= PACCHETTI =========================
  const togglePackage = (p: PackageListItemDto, active: boolean) => {
    if (isReadOnly) return;

    const exists = form.items.find((x) => x.packageId === p.id);

    if (exists && !active) {
      setForm((prev) => ({
        ...prev,
        items: prev.items.filter((x) => x.packageId !== p.id),
      }));
    } else if (!exists && active) {
      const newItem: OfferItemCreateDto = {
        packageId: p.id,
        quantity: 1,
        unitPrice: p.defaultPrice,
        discountType: "None",
        discountValue: 0,
      };

      setForm((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    }
  };

  const updateQty = (id: number, qty: number) => {
    if (isReadOnly) return;

    setForm((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.packageId === id ? { ...i, quantity: qty } : i
      ),
    }));
  };

// Aggiorna il prezzo personalizzato
const updateItemPrice = (id: number, price: number) => {
  if (isReadOnly) return;

  setForm(prev => ({
    ...prev,
    items: prev.items.map(i =>
      i.packageId === id ? { ...i, unitPrice: price } : i
    ),
  }));
};

  // ========================= SUBMIT =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit || isReadOnly) return;
    await onSubmit(form);
  };

  // ===================================================================
  // =============================== UI ===============================
  // ===================================================================

  return (
    <ComponentCard title={isReadOnly ? "Dettagli Offerta" : "Nuova Offerta"}>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ======================= DATI BASE ======================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Cliente */}
          <div>
            <Label>Cliente</Label>
            {isReadOnly ? (
              <Input value={initialData?.customerName ?? "-"} disabled />
            ) : (
              <Select
                value={
                  form.customerId > 0 ? String(form.customerId) : undefined
                }
                options={customers.map((c) => ({
                  value: String(c.id),
                  label: c.firstName + ' ' + c.lastName,
                }))}
                placeholder="Seleziona cliente"
                onChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    customerId: Number(v),
                  }))
                }
              />
            )}
          </div>

          {/* Listino */}
          <div>
            <Label>Listino Prezzi</Label>
            {isReadOnly ? (
              <Input
                value={activePricelist?.name || "-"}
                disabled
              />
            ) : (
              <Select
                value={
                  form.pricelistId ? String(form.pricelistId) : undefined
                }
                options={pricelists.map((pl) => ({
                  value: String(pl.id),
                  label: `${pl.name} (${pl.year})`,
                }))}
                placeholder="Seleziona listino"
                onChange={(v) => handlePricelistChange(Number(v))}
              />
            )}
          </div>
{/* Data evento */}
<div>
  <Label>Data dell'evento</Label>
  {isReadOnly ? (
    <Input value={form.eventDate || "-"} disabled />
  ) : (
    <DatePicker
      selected={form.eventDate ? new Date(form.eventDate) : null}
      onChange={(date: Date | null) =>
        setForm(prev => ({
          ...prev,
          eventDate: date
            ? date.toISOString().substring(0, 10)
            : "",
        }))
      }
      dateFormat="dd-MM-yyyy"
      className="
        h-11 w-full rounded-lg border border-gray-300 bg-transparent
        px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs
        dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
      "
      placeholderText="Seleziona data evento"
    />
  )}
</div>
{/* Tipo di Evento */}
<div>
  <Label>Tipo Evento</Label>
  {isReadOnly ? (
    <Input value={initialData?.eventType ?? "-"} disabled />
  ) : (
    <Select
      value={form.eventType}
      options={[
        { value: "Wedding", label: "Matrimonio" },
        { value: "Party", label: "Festa privata" },
        { value: "Corporate", label: "Evento aziendale" },
        { value: "Birthday", label: "Compleanno" },
      ]}
      onChange={(v) =>
        setForm((prev) => ({
          ...prev,
          eventType: v as any,
        }))
      }
    />
  )}
</div>

{/* Location */}
<div>
  <Label>Location</Label>
  {isReadOnly ? (
    <Input value={initialData?.locationName ?? "-"} disabled />
  ) : (
    <Select
      value={form.locationId ? String(form.locationId) : undefined}
      options={locations.map((l) => ({
        value: String(l.id),
        label: l.name,
      }))}
      placeholder="Seleziona location"
      onChange={(v) =>
        setForm((prev) => ({
          ...prev,
          locationId: Number(v),
        }))
      }
    />
  )}
</div>

          {/* Data scadenza */}
          <div>
  <Label>Data di Scadenza</Label>
  {isReadOnly ? (
    <Input value={form.expirationDate || "-"} disabled />
  ) : (
    <DatePicker
      selected={
        form.expirationDate ? new Date(form.expirationDate) : null
      }
      onChange={(date: Date | null) =>
        setForm((prev) => ({
          ...prev,
          expirationDate: date
            ? date.toISOString().substring(0, 10)
            : "",
        }))
      }
      dateFormat="dd-MM-yyy"
      className="
        h-11 w-full rounded-lg border border-gray-300 bg-transparent
        px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs
        dark:border-gray-700 dark:bg-gray-900 dark:text-white/90
      "
      placeholderText="Seleziona una data"
    />
  )}
</div>

          {/* Tipo sconto */}
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
                onChange={handleDiscountTypeChange}
              />
            )}
          </div>

          {/* Valore sconto */}
          {form.discountType !== "None" && (
            <div>
              <Label>Valore dello Sconto</Label>
              <Input
                name="discountValue"
                type="number"
                value={form.discountValue}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </div>
          )}

          {/* Note */}
          <div className="md:col-span-2">
            <Label>Note</Label>
            <TextArea
              value={form.notes || ""}
              onChange={(v) =>
                !isReadOnly &&
                setForm((prev) => ({
                  ...prev,
                  notes: v,
                }))
              }
              placeholder="Note aggiuntive..."
              rows={4}
              disabled={isReadOnly}
            />
          </div>

          {/* ======================= PACCHETTI ======================= */}
<div className="md:col-span-2">
  <Label>Pacchetti</Label>

  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-2">
    {packages.map(p => {
      const item = form.items.find(i => i.packageId === p.id);
      const selected = !!item;

      return (
        <div
          key={`pkg-${p.id}-${selected}`}
          className="border rounded-lg p-3 bg-white dark:bg-white/[0.05]"
        >
          {/* Header Pacchetto */}
          <div className="flex items-center justify-between">
            <span className="font-medium">{p.name}</span>
            <Switch
              label=""
              defaultChecked={selected}
              disabled={isReadOnly}
              onChange={checked => togglePackage(p, checked)}
            />
          </div>

          {/* Descrizione */}
          <p className="text-sm text-gray-500">{p.description}</p>

          {/* Prezzo base */}
          <div className="mt-2 text-sm">
            € {p.defaultPrice.toFixed(2)} /{" "}
            {p.priceType === "PerPerson" ? "persona" : "forfait"}
          </div>

          {/* Se è selezionato → mostra quantità e prezzo */}
          {selected && (
            <div className="mt-3 space-y-3">
              {/* Quantità */}
              <div>
                <Label>Quantità</Label>
                <Input
                  type="number"
                  min="1"
                  value={item?.quantity ?? 1}
                  onChange={e =>
                    updateQty(p.id, Number(e.target.value) || 1)
                  }
                  disabled={isReadOnly}
                  className="w-24"
                />
              </div>

              {/* Prezzo personalizzato */}
              <div>
                <Label>Prezzo personalizzato (€)</Label>
                <Input
                  type="number"
                  min="0"
                  value={item?.unitPrice ?? p.defaultPrice}
                  onChange={e =>
                    updateItemPrice(p.id, Number(e.target.value) || 0)
                  }
                  disabled={isReadOnly}
                  className="w-32"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Prezzo listino: € {p.defaultPrice.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>

        </div>

        {/* SUBMIT */}
        {!isReadOnly && (
          <div className="flex justify-end">
            <Button variant="primary" disabled={!!submitting}>
              {submitting ? "Salvataggio..." : "Salva Offerta"}
            </Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
