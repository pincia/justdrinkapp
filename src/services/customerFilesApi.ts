import { CustomerFileDto } from "../types/CustomerFile";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE}/customers`;

// ===============================
//  GET ALL FILES
// ===============================
export async function getCustomerFiles(customerId: number): Promise<CustomerFileDto[]> {
  const res = await fetch(`${BASE_URL}/${customerId}/files`);
  if (!res.ok) throw new Error("Failed to load files");
  return res.json();
}

// ===============================
//  UPLOAD FILE
// ===============================
export async function uploadCustomerFile(customerId: number, file: File): Promise<CustomerFileDto> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/${customerId}/files`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("File upload failed");

  return res.json();
}

// ===============================
//  DELETE FILE
// ===============================
export async function deleteCustomerFile(customerId: number, fileId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${customerId}/files/${fileId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("File delete failed");
}

// ===============================
//  DOWNLOAD FILE
// ===============================
export function downloadCustomerFile(customerId: number, fileId: number) {
  const url = `${BASE_URL}/${customerId}/files/${fileId}/download`;

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  link.remove();
}
