import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CustomerForm from "./CustomerForm";
import { createCustomer } from "../../services/customersApi";
import { CustomerCreateDto } from "../../types/Customer";

export default function CustomerCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(data: CustomerCreateDto) {
    try {
      setSaving(true);
      await createCustomer(data);
      navigate("/customers");
    } catch (err) {
      console.error("Error creating customer:", err);
      alert("Failed to create customer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageMeta title="New Customer" description="Add a new customer" />
      <PageBreadcrumb pageTitle="New Customer" />
      <CustomerForm onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
