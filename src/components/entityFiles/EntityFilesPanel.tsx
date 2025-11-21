import { useState } from "react";
import EntityFilesUpload from "./EntityFilesUpload";
import EntityFilesList from "./EntityFilesList";

type Props = {
  entityType: string;
  entityId: number;
};

export default function EntityFilesPanel({ entityType, entityId }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Documents</h2>

      <EntityFilesUpload
        entityType={entityType}
        entityId={entityId}
        onUploaded={() => setRefreshKey((x) => x + 1)}
      />

      <EntityFilesList
        key={refreshKey}
        entityType={entityType}
        entityId={entityId}
      />
    </div>
  );
}
