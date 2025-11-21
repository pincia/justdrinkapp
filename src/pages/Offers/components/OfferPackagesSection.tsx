import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";

import { PackageListItemDto } from "../../../types/Package";
import { OfferCreateDto } from "../../../types/Offer";

import PackageSelectorModal from "./PackageSelectorModal";
import PackageAutocomplete from "./PackageAutocomplete";

type Props = {
  form: OfferCreateDto;
  setForm: (d: OfferCreateDto) => void;
  packages: PackageListItemDto[];
  isReadOnly: boolean;
};

export default function OfferPackagesSection({
  form,
  setForm,
  packages,
  isReadOnly
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  // --- Add a package ---
  const addPackage = (p: PackageListItemDto) => {
    const exists = form.items.some((x) => x.packageId === p.id);
    if (exists) return;

    setForm({
      ...form,
      items: [
        ...form.items,
        {
          packageId: p.id,
          quantity: 1,
          unitPrice: p.defaultPrice,
          discountType: "None",
          discountValue: 0,
        },
      ],
    });
  };

  // --- Remove ---
  const removePackage = (id: number) => {
    setForm({
      ...form,
      items: form.items.filter((i) => i.packageId !== id),
    });
  };

  // --- Update qty ---
  const updateQty = (id: number, qty: number) => {
    setForm({
      ...form,
      items: form.items.map((i) =>
        i.packageId === id ? { ...i, quantity: qty } : i
      ),
    });
  };

  // --- Update price ---
  const updatePrice = (id: number, price: number) => {
    setForm({
      ...form,
      items: form.items.map((i) =>
        i.packageId === id ? { ...i, unitPrice: price } : i
      ),
    });
  };

  // --- Sorted selected packages ---
  const selected = [...form.items].sort((a, b) => {
    const pa = packages.find((p) => p.id === a.packageId);
    const pb = packages.find((p) => p.id === b.packageId);
    if (!pa || !pb) return 0;
    return pa.name.localeCompare(pb.name);
  });

  return (
    <div className="md:col-span-2 mt-6">
           <Label className="text-lg font-bold">Pacchetti</Label>
      <div className="flex justify-between items-center">
   
        {!isReadOnly && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setModalOpen(true)}
            >
              Aggiungi
            </Button>
            <div className="w-64">
              <PackageAutocomplete
                packages={packages}
                onSelect={addPackage}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected packages */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
        {selected.map((item) => {
          const p = packages.find((x) => x.id === item.packageId);
          if (!p) return null;

          return (
            <div
              key={item.packageId}
              className="border rounded-lg p-3 bg-white dark:bg-white/[0.05]"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{p.name}</span>

                {!isReadOnly && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removePackage(p.id)}
                  >
                    Rimuovi
                  </Button>
                )}
              </div>

              <p className="text-sm text-gray-500">{p.description}</p>

              <div className="mt-3 space-y-3">
                {/* Qty */}
                <div>
                  <Label>Quantità</Label>
                  <Input
                    type="number"
                    className="w-24"
                    value={item.quantity}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      updateQty(p.id, Number(e.target.value))
                    }
                  />
                </div>

                {/* Custom price */}
                <div>
                  <Label>Prezzo personalizzato (€)</Label>
                  <Input
                    type="number"
                    className="w-32"
                    value={item.unitPrice}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      updatePrice(p.id, Number(e.target.value))
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Listino: € {p.defaultPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <PackageSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packages={packages}
        onSelect={addPackage}
      />
    </div>
  );
}
