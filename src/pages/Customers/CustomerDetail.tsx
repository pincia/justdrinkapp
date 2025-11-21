import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CustomerForm from "./CustomerForm";
import { getCustomerById } from "../../services/customersApi";
import { CustomerDetailDto } from "../../types/Customer";
import EntityFilesPanel from "../../components/entityFiles/EntityFilesPanel";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<CustomerDetailDto | null>(null);

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

  if (!customer) {
    return <div className="p-6 text-gray-500 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="Customer Detail" description="View customer details" />
      <PageBreadcrumb pageTitle="Customer Detail" />
      <CustomerForm initialData={customer} readOnly />
      <EntityFilesPanel entityType="Customer" entityId={customer.id} />
    </div>
  );
}
