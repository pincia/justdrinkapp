import { useState } from "react";
import { PackageListItemDto } from "../../../types/Package";

type Props = {
  packages: PackageListItemDto[];
  onSelect: (pkg: PackageListItemDto) => void;
};

export default function PackageAutocomplete({ packages, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder="Cerca pacchetto..."
        className="border rounded-lg px-3 py-2 text-sm w-full"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && query && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg border z-50 max-h-60 overflow-y-auto">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onSelect(p);
                setQuery("");
                setOpen(false);
              }}
            >
              {p.name}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-3 py-2 text-gray-400 text-sm">
              Nessun pacchetto trovato
            </div>
          )}
        </div>
      )}
    </div>
  );
}
