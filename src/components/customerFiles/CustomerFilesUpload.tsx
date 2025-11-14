import { useState } from "react";
import { uploadCustomerFile } from "../../services/customerFilesApi";

type Props = {
  customerId: number;
  onUploaded: () => void;
};

export default function CustomerFilesUpload({ customerId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    setUploading(true);

    try {
      await uploadCustomerFile(customerId, file);
      onUploaded();
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-white/[0.03]">
      <label className="font-medium text-gray-700 dark:text-gray-300">
        Upload Document
      </label>

      <input
        type="file"
        onChange={handleUpload}
        className="mt-2 block text-sm"
        disabled={uploading}
      />

      {uploading && <p className="text-sm text-gray-500 mt-2">Uploading…</p>}
    </div>
  );
}
