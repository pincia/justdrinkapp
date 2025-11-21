import { EntityFileDto } from "../types/EntityFile";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ===============================
//  GET FILES
// ===============================
export async function getEntityFiles(entityType: string, entityId: number): Promise<EntityFileDto[]> {
  const res = await fetch(`${API_BASE}/files?entityType=${entityType}&entityId=${entityId}`);
  if (!res.ok) throw new Error("Failed to load files");
  return res.json();
}

// ===============================
//  UPLOAD FILE
// ===============================
export async function uploadEntityFile(entityType: string, entityId: number, file: File): Promise<EntityFileDto> {
  const form = new FormData();
  form.append("file", file);
  form.append("entityType", entityType);
  form.append("entityId", String(entityId));

  const res = await fetch(`${API_BASE}/files`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

// ===============================
//  DELETE FILE
// ===============================
export async function deleteEntityFile(fileId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/files/${fileId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete file");
}

// ===============================
//  DOWNLOAD FILE
// ===============================
export function downloadEntityFile(fileId: number) {
  const url = `${API_BASE}/files/${fileId}/download`;

  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", "");
  document.body.appendChild(a);
  a.click();
  a.remove();
}
