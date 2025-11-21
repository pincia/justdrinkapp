// src/pages/ChecklistTemplates/ChecklistTemplatesList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChecklistTemplateDto,
  ChecklistItemPriority,
} from "../../types/Checklist";
import {
  getChecklistTemplates,
  deleteChecklistTemplate,
} from "../../services/checklistTemplatesApi";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
} from "lucide-react";

function renderPriority(p: ChecklistItemPriority) {
  switch (p) {
    case ChecklistItemPriority.High:
      return "Alta 🔥";
    case ChecklistItemPriority.Medium:
      return "Media ⭐";
    case ChecklistItemPriority.Low:
    default:
      return "Bassa •";
  }
}

export default function ChecklistTemplatesList() {
  const [templates, setTemplates] = useState<ChecklistTemplateDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getChecklistTemplates(search);
      setTemplates(data);
    } catch {
      alert("Impossibile caricare i template checklist");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminare questo template?")) return;
    try {
      await deleteChecklistTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Errore durante l'eliminazione");
    }
  }

  return (
    <div className="p-6">
      {/* Header + Search + New */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Template Checklist</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca per nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <Button onClick={load} variant="outline" size="sm">
            Cerca
          </Button>
          <Link to="/checklist-templates/new">
            <Button
              variant="primary"
              size="sm"
              startIcon={<PlusIcon className="size-4" />}
            >
              Nuovo Template
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabella */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Caricamento template...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Nome</TableCell>
                  <TableCell isHeader>Priorità</TableCell>
                  <TableCell isHeader>Stato</TableCell>
                  {/* <TableCell isHeader>Tipo Evento</TableCell> */}
                  <TableCell isHeader className="text-center">
                    Azioni
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-center">{t.title}</TableCell>
                    <TableCell className="text-center">{renderPriority(t.priority)}</TableCell>
                    <TableCell className="text-center">
                      <Badge color={t.isActive ? "success" : "error"}>
                        {t.isActive ? "Attivo" : "Disattivo"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>{t.eventType ?? "-"}</TableCell> */}
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/checklist-templates/${t.id}/edit`}>
                          <Button
                            size="sm"
                            variant="outline"
                            startIcon={<PencilIcon className="size-4" />}
                          >
                            Modifica
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          startIcon={
                            <TrashIcon className="size-4 text-red-500" />
                          }
                          onClick={() => handleDelete(t.id)}
                        >
                          Elimina
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
