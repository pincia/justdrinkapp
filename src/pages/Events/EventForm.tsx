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
  endDate: new Date().toISOString().substring(0, 10),
  eventType: EventType.Wedding,
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
  const isReadOnly = !!readOnly;

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, customerName, locationName, address, ...rest } = initialData;
      setForm({ ...defaultData, ...rest });
    } else {
      setForm(defaultData);
    }
  }, [initialData]);

  // 🔹 Carica customers e locations
  useEffect(() => {
    async function loadData() {
      try {
        const [cust, loc] = await Promise.all([getCustomers(), getLocations()]);
        setCustomers(cust);
        setLocations(loc);
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
    ({ 0: "Wedding", 1: "Corporate", 2: "Private Party", 3: "Other" }[t]);
  const eventStatusLabel = (s: EventStatus) =>
    ({ 0: "Planned", 1: "Confirmed", 2: "Completed", 3: "Cancelled" }[s]);

  return (
    <ComponentCard title={isReadOnly ? "Event Details" : "Event Information"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Nome evento */}
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Wedding Party"
              disabled={isReadOnly}
            />
          </div>

          {/* Tipo evento */}
          <div>
            <Label>Event Type</Label>
            {isReadOnly ? (
              <Input value={eventTypeLabel(form.eventType)} disabled />
            ) : (
              <Select
                options={[
                  { value: "0", label: "Wedding" },
                  { value: "1", label: "Corporate" },
                  { value: "2", label: "Private Party" },
                  { value: "3", label: "Other" },
                ]}
                placeholder="Select type"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, eventType: Number(val) }))
                }
              />
            )}
          </div>

          {/* Stato evento */}
          <div>
            <Label>Status</Label>
            {isReadOnly ? (
              <Input value={eventStatusLabel(form.status)} disabled />
            ) : (
              <Select
                options={[
                  { value: "0", label: "Planned" },
                  { value: "1", label: "Confirmed" },
                  { value: "2", label: "Completed" },
                  { value: "3", label: "Cancelled" },
                ]}
                placeholder="Select status"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, status: Number(val) }))
                }
              />
            )}
          </div>

          {/* Date */}
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              name="startDate"
              value={form.startDate.substring(0, 10)}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              name="endDate"
              value={form.endDate.substring(0, 10)}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>

          {/* 🔹 Customer Dropdown */}
          <div>
            <Label>Customer</Label>
            {isReadOnly ? (
              <Input
                value={
                  customers.find((c) => c.id === form.customerId)?.name ||
                  initialData?.customerName ||
                  "-"
                }
                disabled
              />
            ) : (
              <Select
                options={customers.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                }))}
                placeholder="Select customer"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, customerId: Number(val) }))
                }
              />
            )}
          </div>

          {/* 🔹 Location Dropdown */}
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
                placeholder="Select location"
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, locationId: Number(val) }))
                }
              />
            )}
          </div>

          {/* Contatti */}
          <div>
            <Label>Contact Person</Label>
            <Input
              name="contactPerson"
              value={form.contactPerson || ""}
              onChange={handleChange}
              placeholder="Contact person name"
              disabled={isReadOnly}
            />
          </div>
          <div>
            <Label>Contact Phone</Label>
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
          <Label>Description</Label>
          <TextArea
            value={form.description || ""}
            onChange={(value) =>
              !isReadOnly && setForm({ ...form, description: value })
            }
            placeholder="Optional notes..."
            rows={5}
            disabled={isReadOnly}
          />
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button variant="primary" disabled={!!submitting}>
              {submitting ? "Saving..." : "Save Event"}
            </Button>
          </div>
        )}
      </form>
    </ComponentCard>
  );
}
