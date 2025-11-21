import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";

import {
  OfferCreateDto,
  OfferDetail,
  OfferItemCreateDto,
  OfferPaymentTermCreateDto,
  DiscountType,
} from "../../types/Offer";

import { CustomerListItemDto } from "../../types/Customer";
import { PackageListItemDto } from "../../types/Package";
import { PricelistListItemDto, PricelistDetailDto } from "../../types/Pricelist";
import { LocationListItemDto } from "../../types/Location";
import { PlannerListItemDto } from "../../types/Planner";

import { getCustomers } from "../../services/customersApi";
import { getPackages } from "../../services/packagesApi";
import { getPricelists, getPricelistById } from "../../services/pricelistsApi";
import { getLocations } from "../../services/locationsApi";
import { getPlanners } from "../../services/plannersApi";

// COMPONENTS
import OfferFormHeader from "./components/OfferFormHeader";
import OfferPackagesSection from "./components/OfferPackagesSection";
import OfferFormActions from "./components/OfferFormActions";
import EntityFilesPanel from "../../components/entityFiles/EntityFilesPanel";

// ----------------------------------------------------
// DEFAULT OFFER (per creazione)
// ----------------------------------------------------
const defaultData: OfferCreateDto = {
  customerId: 0,
  customerName: "",
  
  plannerId: undefined,
  plannerName: "",
  
  pricelistId: undefined,
  pricelistName: "",
  
  locationId: undefined,
  locationName: "",
  
  eventId: undefined,
  eventType: "Matrimonio",

  notes: "",
  eventDate: "",
  expirationDate: "",

  discountType: "None",
  discountValue: 0,

  items: [],
  paymentTerms: [],
};


type Props = {
  initialData?: OfferDetail;
  onSubmit?: (data: OfferCreateDto) => Promise<void> | void;
  submitting?: boolean;
  readOnly?: boolean;
};

export default function OfferForm({ initialData, onSubmit, submitting, readOnly }: Props) {
  const isReadOnly = !!readOnly;

  // Global loading
  const [loaded, setLoaded] = useState(false);

  // Form state
  const [form, setForm] = useState<OfferCreateDto>(defaultData);

  // Dropdown data
  const [customers, setCustomers] = useState<CustomerListItemDto[]>([]);
  const [packages, setPackages] = useState<PackageListItemDto[]>([]);
  const [pricelists, setPricelists] = useState<PricelistListItemDto[]>([]);
  const [locations, setLocations] = useState<LocationListItemDto[]>([]);
  const [planners, setPlanners] = useState<PlannerListItemDto[]>([]);

  const [activePricelist, setActivePricelist] = useState<PricelistDetailDto | null>(null);

  // ----------------------------------------------------
  // LOAD DROPDOWNS
  // ----------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const [cust, pack, prl, loc, pls] = await Promise.all([
          getCustomers(),
          getPackages(),
          getPricelists(),
          getLocations(),
          getPlanners(),
        ]);

        setCustomers(cust);
        setPackages(pack);
        setPricelists(prl);
        setLocations(loc);
        setPlanners(pls);

        setLoaded(true);
      } catch (err) {
        console.error("❌ Error loading dropdowns:", err);
      }
    })();
  }, []);

  // ----------------------------------------------------
  // APPLY INITIAL DATA (EDIT MODE)
  // ----------------------------------------------------
  useEffect(() => {
    if (!initialData || !loaded) return;

    const items: OfferItemCreateDto[] =
      initialData.items?.map((i) => ({
        packageId: i.packageId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discountType: i.discountType as DiscountType,
        discountValue: i.discountValue,
      })) ?? [];

    const terms: OfferPaymentTermCreateDto[] =
      initialData.paymentTerms?.map((t) => ({
        percentage: t.percentage,
        dueDate: t.dueDate,
        paymentMethod: t.paymentMethod,
      })) ?? [];

    setForm({
      customerId: initialData.customerId,
      customerName: initialData.customerName,

      plannerId: initialData.plannerId ?? undefined,
      plannerName: initialData.plannerName,

      pricelistId: initialData.pricelistId,

      locationId: initialData.locationId,
      locationName: initialData.locationName,

      eventType: initialData.eventType || "Matrimonio",
      notes: initialData.notes,

      eventDate: initialData.eventDate?.substring(0, 10) || "",
      expirationDate: initialData.expirationDate?.substring(0, 10) || "",

      discountType: initialData.discountType,
      discountValue: initialData.discountValue,

      items,
      paymentTerms: terms,
    });
  }, [initialData, loaded]);

  // ----------------------------------------------------
  // UPDATE PRICELIST DETAILS
  // ----------------------------------------------------
useEffect(() => {
  if (form.pricelistId == null) return; // evita undefined e null

  (async () => {
    try {
      const detail = await getPricelistById(Number(form.pricelistId));
      setActivePricelist(detail);
    } catch (err) {
      console.error("Errore caricando il listino:", err);
    }
  })();
}, [form.pricelistId]);

  // ----------------------------------------------------
  // CHANGE PRICELIST
  // ----------------------------------------------------
  const handlePricelistChange = async (id: number) => {
    if (isReadOnly) return;

    setForm((prev) => ({ ...prev, pricelistId: id }));

    try {
      const pl = await getPricelistById(id);
      setActivePricelist(pl);

      // Update default prices for packages when switching price list
      setPackages((prev) =>
        prev.map((p) => {
          const found = pl.packages.find((x) => x.packageId === p.id);
          return { ...p, defaultPrice: found ? found.price : p.defaultPrice };
        })
      );
    } catch (err) {
      console.error("❌ Error changing pricelist:", err);
    }
  };

const calculateTotals = () => {
  const subtotal = form.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  let discount = 0;
  if (form.discountType === "Percent") {
    discount = subtotal * (form.discountValue / 100);
  } else if (form.discountType === "Fixed") {
    discount = form.discountValue;
  }

  const total = subtotal - discount;

  return { subtotal, discount, total };
};

const totals = calculateTotals();

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !onSubmit) return;
    await onSubmit(form);
  };

  // ----------------------------------------------------
  // LOADING UI
  // ----------------------------------------------------
  if (!loaded) {
    return (
      <ComponentCard title="Caricamento...">
        <p className="p-4">Caricamento dati...</p>
      </ComponentCard>
    );
  }

  // ----------------------------------------------------
  // MAIN UI RENDER
  // ----------------------------------------------------
  return (
    <ComponentCard title={isReadOnly ? "Dettagli Offerta" : "Nuova Offerta"}>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* HEADER */}
        <OfferFormHeader
          form={form}
          setForm={setForm}
          isReadOnly={isReadOnly}
          customers={customers}
          planners={planners}
          pricelists={pricelists}
          locations={locations}
          activePricelist={activePricelist}
          handlePricelistChange={handlePricelistChange}
        />

        {/* PACKAGES */}
        <OfferPackagesSection
          form={form}
          setForm={setForm}
          packages={packages}
          isReadOnly={isReadOnly}
        />
        {/* TOTALS PANEL */}
        <div className="border rounded-lg p-4 bg-gray-50 mt-6 dark:bg-white/[0.05]">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotale pacchetti:</span>
            <span>€ {totals.subtotal.toFixed(2)}</span>
          </div>

          {form.discountType !== "None" && (
            <div className="flex justify-between text-sm mb-2">
              <span>Sconto ({form.discountType === "Percent" ? form.discountValue + "%" : "€ " + form.discountValue}):</span>
              <span>- € {totals.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
            <span>Totale Offerta:</span>
            <span>€ {totals.total.toFixed(2)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <OfferFormActions submitting={submitting} isReadOnly={isReadOnly} />

      </form>

        <ComponentCard title="Documenti Offerta">
        <EntityFilesPanel entityType="Offer" entityId={initialData?.id ?? -1} />
      </ComponentCard>
    </ComponentCard>
  );
}
