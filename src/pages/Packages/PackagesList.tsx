import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPackages, deletePackage } from "../../services/packagesApi";
import { PackageListItemDto } from "../../types/Package";
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

export default function PackagesList() {
  const [packages, setPackages] = useState<PackageListItemDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getPackages({ search });
      setPackages(data);
    } catch {
      alert("Failed to load packages");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this package?")) return;
    try {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete package");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Packages</h1>

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
          <Link to="/packages/new">
            <Button variant="primary" size="sm" startIcon={<PlusIcon className="size-4" />}>
              New Package
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
                  <TableCell isHeader>Name</TableCell>
                  <TableCell isHeader>Category</TableCell>
                  <TableCell isHeader>Price Type</TableCell>
                  <TableCell isHeader>Price</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader className="text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.priceType}</TableCell>
                    <TableCell>€ {p.defaultPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge color={p.isActive ? "success" : "error"}>
                        {p.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/packages/${p.id}`}>
                          <Button size="sm" variant="outline" startIcon={<EyeIcon className="size-4" />}>View</Button>
                        </Link>
                        <Link to={`/packages/${p.id}/edit`}>
                          <Button size="sm" variant="outline" startIcon={<PencilIcon className="size-4" />}>Edit</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={<TrashIcon className="size-4 text-red-500" />}
                          onClick={() => handleDelete(p.id)}
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
