import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPricelists, deletePricelist } from "../../services/pricelistsApi";
import { PricelistListItemDto } from "../../types/Pricelist";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, SearchIcon } from "lucide-react";

export default function PricelistsList() {
  const [pricelists, setPricelists] = useState<PricelistListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getPricelists();
      setPricelists(data);
    } catch {
      alert("Errore nel caricamento dei listini");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminare questo listino?")) return;
    try {
      await deletePricelist(id);
      setPricelists((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Errore nell'eliminazione del listino");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Listini Prezzi</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <Button onClick={load} variant="outline" size="sm">Cerca</Button>
          <Link to="/pricelists/new">
            <Button variant="primary" size="sm" startIcon={<PlusIcon className="size-4" />}>
              Nuovo Listino
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Caricamento...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Nome</TableCell>
                <TableCell isHeader>Anno</TableCell>
                <TableCell isHeader>Tipo Cliente</TableCell>
                <TableCell isHeader>Pacchetti</TableCell>
                <TableCell isHeader>Stato</TableCell>
                <TableCell isHeader className="text-center">Azioni</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricelists.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.year}</TableCell>
                  <TableCell>{p.customerType}</TableCell>
                  <TableCell>{p.totalPackages}</TableCell>
                  <TableCell>
                    <Badge color={p.isActive ? "success" : "error"}>
                      {p.isActive ? "Attivo" : "Disattivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Link to={`/pricelists/${p.id}`}>
                        <Button size="sm" variant="outline" startIcon={<EyeIcon className="size-4" />}>Vedi</Button>
                      </Link>
                      <Link to={`/pricelists/${p.id}/edit`}>
                        <Button size="sm" variant="outline" startIcon={<PencilIcon className="size-4" />}>Modifica</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        startIcon={<TrashIcon className="size-4 text-red-500" />}
                        onClick={() => handleDelete(p.id)}
                      >
                        Elimina
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
