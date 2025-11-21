import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLocations, deleteLocation } from "../../services/locationsApi";
import { LocationListItemDto } from "../../types/Location";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, SearchIcon } from "lucide-react";

export default function LocationsList() {
  const [locations, setLocations] = useState<LocationListItemDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getLocations(search);
      setLocations(data);
    } catch {
      alert("Failed to load locations");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this location?")) return;
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("Failed to delete location");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Locations</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <Button onClick={load} variant="outline" size="sm">Search</Button>
          <Link to="/locations/new">
            <Button variant="primary" size="sm" startIcon={<PlusIcon className="size-4" />}>
              New Location
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Nome</TableCell>
                  <TableCell isHeader>Città</TableCell>
                  <TableCell isHeader>Provincia</TableCell>
                  <TableCell isHeader>Stato</TableCell>
                  <TableCell isHeader className="text-center">Azioni</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell  className="text-center">{l.name}</TableCell>
                    <TableCell className="text-center">{l.city || "-"}</TableCell>
                    <TableCell className="text-center">{l.province || "-"}</TableCell>
                    <TableCell className="text-center">
                      <Badge color={l.isActive ? "success" : "error"}>
                        {l.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/locations/${l.id}`}>
                          <Button size="sm" variant="outline" startIcon={<EyeIcon className="size-4" />}>View</Button>
                        </Link>
                        <Link to={`/locations/${l.id}/edit`}>
                          <Button size="sm" variant="outline" startIcon={<PencilIcon className="size-4" />}>Edit</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={<TrashIcon className="size-4 text-red-500" />}
                          onClick={() => handleDelete(l.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
