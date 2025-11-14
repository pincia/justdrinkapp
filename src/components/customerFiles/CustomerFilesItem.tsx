import { Download, Trash2 } from "lucide-react";
import { downloadCustomerFile } from "../../services/customerFilesApi";
import { CustomerFileDto } from "../../types/CustomerFile";

type Props = {
  file: CustomerFileDto;
  onDelete: (id: number) => void;
};

export default function CustomerFilesItem({ file, onDelete }: Props) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(2);

  return (
    <div className="flex justify-between items-center p-3 border rounded-lg bg-white dark:bg-white/[0.05] shadow-sm">
      <div className="flex flex-col">
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {file.fileName}
        </span>

        <span className="text-xs text-gray-500">
          {sizeMB} MB • {new Date(file.uploadedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-3">
        {/* DOWNLOAD BUTTON */}
        <button
          onClick={() => downloadCustomerFile(file.customerId, file.id)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <Download size={16} />
          Download
        </button>

        {/* DELETE BUTTON */}
        <button
          className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
          onClick={() => onDelete(file.id)}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
