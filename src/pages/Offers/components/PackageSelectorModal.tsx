import { useState } from "react";
import { PackageListItemDto } from "../../../types/Package";
import Button from "../../../components/ui/button/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  packages: PackageListItemDto[];
  onSelect: (p: PackageListItemDto) => void;
};

export default function PackageSelectorModal({
  isOpen,
  onClose,
  packages,
  onSelect
}: Props) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // 🔥 Overlay corretto: copre TUTTO senza lasciare pixel bianchi
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">

      {/* Modal */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-[520px] max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Aggiungi Pacchetto</h2>
        </div>

        {/* Search */}
        <div className="p-6 pt-4">
          <input
            type="text"
            placeholder="Cerca..."
            className="border rounded-lg w-full px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="px-6 pb-4 overflow-y-auto space-y-3 flex-1">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="border dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex justify-between items-center"
            >
              <div className="mr-4">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{p.description}</div>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  onSelect(p);
                  onClose();
                }}
              >
                Aggiungi
              </Button>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-400 text-sm text-center">
              Nessun pacchetto trovato
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button variant="outline" onClick={onClose}>Chiudi</Button>
        </div>
      </div>
    </div>
  );
}
