import { useEffect, useState } from "react";
import { EntityFileDto } from "../../types/EntityFile";
import Button from "../ui/button/Button";
import { getEntityFiles, deleteEntityFile, downloadEntityFile } from "../../services/entityFilesApi";

type Props = {
  entityType: string;
  entityId: number;
};

export default function EntityFilesList({ entityType, entityId }: Props) {
  const [files, setFiles] = useState<EntityFileDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEntityFiles(entityType, entityId);
        setFiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [entityType, entityId]);

  async function handleDelete(id: number) {
    if (!confirm("Delete file?")) return;
    await deleteEntityFile(id);
    setFiles(files.filter(f => f.id !== id));
  }

  if (loading) return <p>Loading files...</p>;

  return (
    <div className="border rounded-md p-4 bg-white dark:bg-slate-800">
      {files.length === 0 && <p className="text-sm text-gray-500">No files</p>}

      <ul className="space-y-3">
        {files.map((file) => (
          <li key={file.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium">{file.fileName}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB — {new Date(file.uploadedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" onClick={() => downloadEntityFile(file.id)}>
                Download
              </Button>
              <Button variant="outline" onClick={() => handleDelete(file.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
