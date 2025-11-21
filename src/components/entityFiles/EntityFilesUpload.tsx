import { useState } from "react";
import { uploadEntityFile } from "../../services/entityFilesApi";

type Props = {
  entityType: string;
  entityId: number;
  onUploaded: () => void;
};

export default function EntityFilesUpload({ entityType, entityId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      await uploadEntityFile(entityType, entityId, file);
      onUploaded();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block mb-2 text-sm font-medium">Upload file</label>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="block"
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
    </div>
  );
}
