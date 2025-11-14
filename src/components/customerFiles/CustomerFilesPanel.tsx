import CustomerFilesUpload from "./CustomerFilesUpload";
import CustomerFilesList from "./CustomerFilesList";
import { useState } from "react";

type Props = {
  customerId: number;
};

export default function CustomerFilesPanel({ customerId }: Props) {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xl font-semibold">Documents</h2>

      <CustomerFilesUpload
        customerId={customerId}
        onUploaded={() => setRefresh((x) => x + 1)}
      />

      <CustomerFilesList key={refresh} customerId={customerId} />
    </div>
  );
}
