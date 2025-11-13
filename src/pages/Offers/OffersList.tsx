import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOffers, deleteOffer } from "../../services/offersApi";
import { OfferListItem } from "../../types/Offer";
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

export default function OffersList() {
  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getOffers({ search });
      setOffers(data);
    } catch {
      alert("Failed to load offers");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this offer?")) return;
    try {
      await deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch {
      alert("Failed to delete offer");
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Offers</h1>

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
          <Link to="/offers/new">
            <Button variant="primary" size="sm" startIcon={<PlusIcon className="size-4" />}>
              New Offer
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
                  <TableCell isHeader>Code</TableCell>
                  <TableCell isHeader>Customer</TableCell>
                  <TableCell isHeader>Event</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Total</TableCell>
                  <TableCell isHeader>Expiration</TableCell>
                  <TableCell isHeader className="text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.code}</TableCell>
                    <TableCell>{o.customerName}</TableCell>
                    <TableCell>{o.eventName || "-"}</TableCell>
                    <TableCell>
                      <Badge color={o.status === "Accepted" ? "success" : o.status === "Draft" ? "warning" : "primary"}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell>€ {o.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{o.expirationDate ? new Date(o.expirationDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/offers/${o.id}`}>
                          <Button size="sm" variant="outline" startIcon={<EyeIcon className="size-4" />}>View</Button>
                        </Link>
                        <Link to={`/offers/${o.id}/edit`}>
                          <Button size="sm" variant="outline" startIcon={<PencilIcon className="size-4" />}>Edit</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={<TrashIcon className="size-4 text-red-500" />}
                          onClick={() => handleDelete(o.id)}
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
