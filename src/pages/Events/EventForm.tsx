import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import { EventCreateDto, EventDetailDto, EventStatus, EventType } from "../../types/Event";
import { getCustomers } from "../../services/customersApi";
import { getLocations } from "../../services/locationsApi";
import { CustomerListItemDto } from "../../types/Customer";
import { LocationListItemDto } from "../../types/Location";
import { PlannerListItemDto } from "../../types/Planner";
import { getPlanners } from "../../services/plannersApi";

type Props = {
  initialData?: EventDetailDto;
  onSubmit?: (data: EventCreateDto) => Promise<void> | void;
  submitting?: boolean;
  readOnly?: boolean;
};

const defaultData: EventCreateDto = {
  name: "",
  description: "",
  startDate: new Date().toISOString().substring(0, 10),
  eventType: EventType.Matrimonio,
  status: EventStatus.Planned,
  contactPerson: "",
  contactPhone: "",
  customerId: 0,
  locationId: undefined,
};

export default function EventForm({ initialData, onSubmit, submitting, readOnly }: Props) {
  const [form, setForm] = useState<EventCreateDto>(defaultData);
  const [customers, setCustomers] = useState<CustomerListItemDto[]>([]);
  const [locations, setLocations] = useState<LocationListItemDto[]>([]);
  const [planners, setPlanners] = useState<PlannerListItemDto[]>([]);

  const isReadOnly = !!readOnly;

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, customerName, locationName, address, ...rest } = initialData;
      setForm({ ...defaultData, ...rest });
    } else {
      setForm(defaultData);
    }
  }, [initialData]);

  // 🔹 Carica clienti e location
  useEffect(() => {
    async function loadData() {
      try {
        const [cust, loc, pls] = await Promise.all([getCustomers(), getLocations(), getPlanners()]);
        setCustomers(cust);
        setLocations(loc);
        setPlanners(pls);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    }
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !onSubmit) return;
    await onSubmit(form);
  };

  // Helpers per etichette
  const eventTypeLabel = (t: EventType) =>
    ({ 1: "Matrimonio", 2: "Evento Aziendale", 3: "Festa Privata", 4: "Altro" ,5: "MixologyExperience" }[t]);

  const eventStatusLabel = (s: EventStatus) =>
    ({ 0: "Pianificato", 1: "Confermato", 2: "Completato", 3: "Annullato" }[s]);

  return (
    <ComponentCard title={isReadOnly ? "Dettagli Evento" : "Informazioni Evento"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Nome evento */}
          <div>
            <Label>Nome</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome evento"
              disabled={isReadOnly}
            />
          </div>

          {/* Tipo evento */}
          <div>
            <Label>Tipo Evento</Label>
            {isReadOnly ? (
              <Input value={eventTypeLabel(form.eventType)} disabled />
            ) : (
              <Select
                options={[
                  { value: "1", label: "Matrimonio" },
                  { value: "2", label: "Evento Aziendale" },
                  { value: "3", label: "Evento Privato" },
                  { value: "4", label: "Evento Pubblico" },
                ]}
                placeholder="Seleziona tipo"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, eventType: Number(val) }))
                }
              />
            )}
          </div>

          {/* Stato evento */}
          <div>
            <Label>Stato</Label>
            {isReadOnly ? (
              <Input value={eventStatusLabel(form.status)} disabled />
            ) : (
              <Select
                options={[
                  { value: "0", label: "Pianificato" },
                  { value: "1", label: "Confermato" },
                  { value: "2", label: "Completato" },
                  { value: "3", label: "Annullato" },
                ]}
                placeholder="Seleziona stato"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, status: Number(val) }))
                }
              />
            )}
          </div>

          {/* Date */}
          <div>
            <Label>Data Evento</Label>
            <Input
              type="date"
              name="startDate"
              value={form.startDate.substring(0, 10)}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>
          {/* Cliente */}
          <div>
            <Label>Cliente</Label>
            {isReadOnly ? (
              <Input
                value={
                  customers.find((c) => c.id === form.customerId)?.lastName ||
                  initialData?.customerName ||
                  "-"
                }
                disabled
              />
            ) : (
              <Select
                options={customers.map((c) => ({
                  value: String(c.id),
                  label: c.firstName + " " + c.lastName,
                }))}
                placeholder="Seleziona cliente"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, customerId: Number(val) }))
                }
              />
            )}
          </div>

          {/* Planner */}
          <div>
            <Label>Wedding Planner / Organizzatore</Label>

            {isReadOnly ? (
              <Input
                value={initialData?.plannerName ?? "-"}
                disabled
              />
            ) : (
              <Select
                options={[
                  { value: "", label: "Nessuno" },
                  ...planners.map((p) => ({
                    value: String(p.id),
                    label: p.fullName + (p.companyName ? " (" + p.companyName + ")" : "")
                  }))
                ]}
                placeholder="Seleziona planner"
                onChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    plannerId: v ? Number(v) : undefined
                  }))
                }
              />
            )}
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            {isReadOnly ? (
              <Input
                value={
                  locations.find((l) => l.id === form.locationId)?.name ||
                  initialData?.locationName ||
                  "-"
                }
                disabled
              />
            ) : (
              <Select
                options={locations.map((l) => ({
                  value: String(l.id),
                  label: l.name,
                }))}
                placeholder="Seleziona location"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, locationId: Number(val) }))
                }
              />
            )}
          </div>

          {/* Contatti */}
          <div>
            <Label>Referente</Label>
            <Input
              name="contactPerson"
              value={form.contactPerson || ""}
              onChange={handleChange}
              placeholder="Nome referente"
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label>Telefono Referente</Label>
            <Input
              name="contactPhone"
              value={form.contactPhone || ""}
              onChange={handleChange}
              placeholder="+39 ..."
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Descrizione */}
        <div>
          <Label>Descrizione</Label>
          <TextArea
            value={form.description || ""}
            onChange={(value) =>
              !isReadOnly && setForm({ ...form, description: value })
            }
            placeholder="Note opzionali..."
            rows={5}
            disabled={isReadOnly}
          />
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button variant="primary" disabled={!!submitting}>
              {submitting ? "Salvataggio..." : "Salva Evento"}
            </Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
