import { useEffect, useState } from "react";
import CustomerFilesItem from "./CustomerFilesItem";
import { deleteCustomerFile, getCustomerFiles } from "../../services/customerFilesApi";
import { CustomerFileDto } from "../../types/CustomerFile";

type Props = {
  customerId: number;
};

export default function CustomerFilesList({ customerId }: Props) {
  const [files, setFiles] = useState<CustomerFileDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); 
    try {
      const data = await getCustomerFiles(customerId);
      setFiles(data);
    } catch (err) {
      console.error("Error loading files", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this file?")) return;
    await deleteCustomerFile(customerId, id);
    load();
  }

  useEffect(() => {
    load();
  }, [customerId]);

  if (loading) {
    return <div className="text-gray-500 p-4">Loading files…</div>;
  }

  return (
    <div className="space-y-3">
      {files.length === 0 ? (
        <p className="text-sm text-gray-500">No files uploaded.</p>
      ) : (
        files.map((f) => (
          <CustomerFilesItem key={f.id} file={f} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}
