import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CustomerForm from "./CustomerForm";
import { getCustomerById, updateCustomer } from "../../services/customersApi";
import { CustomerCreateDto, CustomerDetailDto } from "../../types/Customer";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetailDto | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCustomerById(Number(id));
        setCustomer(data);
      } catch (err) {
        console.error("Error fetching customer:", err);
        alert("Customer not found");
      }
    }
    load();
  }, [id]);

  async function handleSubmit(dto: CustomerCreateDto) {
    try {
      setSaving(true);
      await updateCustomer(Number(id), dto);
      navigate("/customers");
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer");
    } finally {
      setSaving(false);
    }
  }

  if (!customer) {
    return <div className="p-6 text-gray-500 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Edit Customer" description="Modify customer details" />
      <PageBreadcrumb pageTitle="Edit Customer" />
      <CustomerForm initialData={customer} onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
