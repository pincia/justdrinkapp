import { useEffect, useMemo, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";

import {
  PricelistCreateDto,
  PricelistDetailDto,
  PricelistPackageRow,
} from "../../types/Pricelist";
import { CustomerType, CustomerTypeLabel } from "../../types/Customer";
import { getPackages } from "../../services/packagesApi";
import { PackageListItemDto } from "../../types/Package";

type Props = {
  initialData?: PricelistDetailDto;
  onSubmit: (data: PricelistCreateDto) => Promise<void> | void;
  submitting?: boolean;
  readOnly?: boolean;
};

const defaultForm: PricelistCreateDto = {
  name: "",
  year: new Date().getFullYear(),
  customerType: CustomerType.Private,
  priceMultiplier: 1,
  isActive: true,
  packages: [],
};

export default function PricelistForm({
  initialData,
  onSubmit,
  submitting,
  readOnly,
}: Props) {
  const [form, setForm] = useState<PricelistCreateDto>(defaultForm);
  const [, setAllPackages] = useState<PackageListItemDto[]>([]);
  const [rows, setRows] = useState<PricelistPackageRow[]>([]);
  const isReadOnly = !!readOnly;

  // Carica pacchetti + mappa initialData
  useEffect(() => {
    async function load() {
      const pkgs = await getPackages(); // deve restituire almeno: id, name, defaultPrice
      setAllPackages(pkgs);

      // Base form
      if (initialData) {
        const { id, packages, ...rest } = initialData;
        setForm({ ...defaultForm, ...rest });

        // Mappa righe: tutti i pacchetti, marcando included quelli presenti in initialData.packages
        const rowsMapped: PricelistPackageRow[] = pkgs.map((p) => {
          const found = packages?.find((x) => x.packageId === p.id);
          return {
            packageId: p.id,
            packageName: p.name,
            defaultPrice: p.defaultPrice ?? 0,
            included: !!found,
            price: found ? found.price : (p.defaultPrice ?? 0),
          };
        });
        setRows(rowsMapped);
      } else {
        setForm(defaultForm);
        const rowsMapped: PricelistPackageRow[] = pkgs.map((p) => ({
          packageId: p.id,
          packageName: p.name,
          defaultPrice: p.defaultPrice ?? 0,
          included: false,
          price: p.defaultPrice ?? 0,
        }));
        setRows(rowsMapped);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Helpers
  const customerTypeOptions = useMemo(
    () =>
      Object.entries(CustomerTypeLabel).map(([value, label]) => ({
        value,
        label,
      })),
    []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "priceMultiplier"
          ? Number(value)
          : (value as any),
    }));
  };

  const toggleInclude = (packageId: number, included: boolean) => {
    if (isReadOnly) return;
    setRows((prev) =>
      prev.map((r) =>
        r.packageId === packageId
          ? {
              ...r,
              included,
              // se lo includo e il prezzo era 0, imposto defaultPrice
              price: included ? (r.price || r.defaultPrice) : r.price,
            }
          : r
      )
    );
  };

  const changePrice = (packageId: number, price: number) => {
    if (isReadOnly) return;
    setRows((prev) =>
      prev.map((r) => (r.packageId === packageId ? { ...r, price } : r))
    );
  };

  const addAll = () => {
    if (isReadOnly) return;
    setRows((prev) =>
      prev.map((r) => ({ ...r, included: true, price: r.price || r.defaultPrice }))
    );
  };

  const removeAll = () => {
    if (isReadOnly) return;
    setRows((prev) => prev.map((r) => ({ ...r, included: false })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const packages = rows
      .filter((r) => r.included)
      .map((r) => ({
        packageId: r.packageId,
        price: Number(r.price || 0),
      }));

    await onSubmit({
      ...form,
      packages,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card: Dati generali */}
      <ComponentCard title={isReadOnly ? "Dettaglio Listino" : "Informazioni Listino"}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Nome Listino</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="Listino Wedding 2026"
            />
          </div>

          <div>
            <Label>Anno</Label>
            <Input
              type="number"
              name="year"
              min={"2020"}
              max={"2100"}
              value={form.year}
              onChange={handleChange}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Tipo Cliente</Label>
            {isReadOnly ? (
              <Input value={CustomerTypeLabel[form.customerType]} disabled />
            ) : (
              <Select
                options={customerTypeOptions}
                placeholder="Seleziona tipo cliente"
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    customerType: Number(val) as CustomerType,
                  }))
                }
              />
            )}
          </div>

          <div>
            <Label>Moltiplicatore Prezzo</Label>
            <Input
              type="number"
              name="priceMultiplier"
              value={form.priceMultiplier ?? ""}
              onChange={handleChange}
              disabled={isReadOnly}
              placeholder="1.0"
            />
          </div>

          <div>
            <Switch
              label="Attivo"
              defaultChecked={form.isActive}
              onChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Card: Pacchetti del listino */}
      <ComponentCard title="Pacchetti del Listino">
        {/* Azioni rapide */}
        {!isReadOnly && (
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" onClick={addAll} >
              Aggiungi tutti
            </Button>
            <Button variant="outline" onClick={removeAll}>
              Rimuovi tutti
            </Button>
          </div>
        )}

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Includi</th>
                <th className="p-2 text-left">Pacchetto</th>
                <th className="p-2 text-left">Prezzo base</th>
                <th className="p-2 text-left">Prezzo listino</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.packageId} className="border-t">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={r.included}
                      onChange={(e) => toggleInclude(r.packageId, e.target.checked)}
                      disabled={isReadOnly}
                    />
                  </td>
                  <td className="p-2">{r.packageName}</td>
                  <td className="p-2">€ {Number(r.defaultPrice).toFixed(2)}</td>
                  <td className="p-2">
                    {r.included ? (
                      <Input
                        type="number"
                        value={r.price}
                        onChange={(e) => changePrice(r.packageId, Number(e.target.value))}
                        disabled={isReadOnly}
                        className="w-32"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={4}>
                    Nessun pacchetto disponibile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end mt-6">
            <Button variant="primary" disabled={!!submitting}>
              {submitting ? "Salvataggio..." : "Salva Listino"}
            </Button>
          </div>
        )}
      </ComponentCard>
    </form>
  );
}
