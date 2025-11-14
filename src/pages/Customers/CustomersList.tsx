import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomers, deleteCustomer } from "../../services/customersApi";
import { CustomerListItemDto } from "../../types/Customer";
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

export default function CustomersList() {
  const [customers, setCustomers] = useState<CustomerListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    try {
      const data = await getCustomers(search);
      setCustomers(data);
    } catch (err) {
      console.error("❌ Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete customer.");
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-3 sm:mb-0">Customers</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <Button variant="outline" size="sm" onClick={loadCustomers}>
            Search
          </Button>

          <Link to="/customers/new">
            <Button variant="primary" size="sm" startIcon={<PlusIcon className="size-4" />}>
              New Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3">Name</TableCell>
                  <TableCell isHeader>Email</TableCell>
                  <TableCell isHeader>Phone</TableCell>
                  <TableCell isHeader>Type</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader className="text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
                      {c.fullName}
                    </TableCell>
                    <TableCell>{c.email || "-"}</TableCell>
                    <TableCell>{c.phone || "-"}</TableCell>
                    <TableCell>
                      {c.customerType === 0
                        ? "Private"
                        : c.customerType === 1
                        ? "Company"
                        : "Other"}
                    </TableCell>
                    <TableCell>
                      <Badge size="sm" color={c.isActive ? "success" : "error"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                          <Link to={`/customers/${c.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            startIcon={<EyeIcon className="size-4" />}
                          >
                            View
                          </Button>
                        </Link>
                     <Link to={`/customers/${c.id}/edit`}>
                          <Button
                            size="sm"
                            variant="outline"
                            startIcon={<PencilIcon className="size-4" />}
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={<TrashIcon className="size-4 text-red-500" />}
                          onClick={() => handleDelete(c.id)}
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
