// src/components/checklist/EventChecklistPanel.tsx
import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  EventChecklistItemDto,
  ChecklistItemPriority,
  ChecklistItemStatus,
} from "../../types/Checklist";

import {
  getEventChecklist,
  addEventChecklistItem,
  updateEventChecklistItem,
  deleteEventChecklistItem,
} from "../../services/eventChecklistApi";

import { PlusIcon, TrashIcon } from "lucide-react";

type Props = {
  eventId: number;
};

/* ===========================================================
   🎨 Row colors based on status + priority
   =========================================================== */
function getRowClass(item: EventChecklistItemDto) {
  if (item.status === ChecklistItemStatus.Done) return "bg-green-100";
  if (item.status === ChecklistItemStatus.NotNeeded) return "bg-gray-200";

  // TODO → color by priority
  switch (item.priority) {
    case ChecklistItemPriority.High:
      return "bg-red-100";
    case ChecklistItemPriority.Medium:
      return "bg-yellow-100";
    case ChecklistItemPriority.Low:
    default:
      return "bg-gray-100";
  }
}

/* ===========================================================
   🎖 Priority badge
   =========================================================== */
function renderPriorityBadge(priority: ChecklistItemPriority) {
  switch (priority) {
    case ChecklistItemPriority.High:
      return <Badge color="error">🔥 Alta</Badge>;
    case ChecklistItemPriority.Medium:
      return <Badge color="warning">⭐ Media</Badge>;
    case ChecklistItemPriority.Low:
    default:
      return <Badge color="info">• Bassa</Badge>;
  }
}

export default function EventChecklistPanel({ eventId }: Props) {
  const [items, setItems] = useState<EventChecklistItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [newLabel, setNewLabel] = useState("");
  const [newPriority, setNewPriority] = useState<ChecklistItemPriority>(
    ChecklistItemPriority.Medium
  );
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    load();
  }, [eventId]);

  async function load() {
    setLoading(true);
    try {
      const data = await getEventChecklist(eventId);
      setItems(data);
    } catch {
      alert("Impossibile caricare la checklist dell'evento");
    } finally {
      setLoading(false);
    }
  }

  /* ===========================================================
     ➕ Add item (label + priority + notes)
     =========================================================== */
  async function handleAdd() {
    if (!newLabel.trim()) return;

    try {
      // 1) creo la voce minima (come già facevi prima)
      const created = await addEventChecklistItem(eventId, newLabel.trim());

      let finalItem = created;

      // 2) aggiorno subito priority + notes (se valorizzati)
      if (
        newNotes.trim() ||
        newPriority !== created.priority // nel dubbio lo forziamo
      ) {
        await updateEventChecklistItem(eventId, created.id, {
          notes: newNotes.trim() || undefined,
          priority: newPriority,
        });

        finalItem = {
          ...created,
          notes: newNotes.trim() || "",
          priority: newPriority,
        };
      }

      setItems((prev) => [...prev, finalItem]);

      // reset form
      setNewLabel("");
      setNewPriority(ChecklistItemPriority.Medium);
      setNewNotes("");
    } catch {
      alert("Errore durante l'aggiunta della voce");
    }
  }

  /* ===========================================================
     🔄 Update status
     =========================================================== */
  async function handleStatusChange(
    item: EventChecklistItemDto,
    status: ChecklistItemStatus
  ) {
    try {
      await updateEventChecklistItem(eventId, item.id, { status });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status } : i))
      );
    } catch {
      alert("Errore durante l'aggiornamento dello stato");
    }
  }

  /* ===========================================================
     🎯 Update priority
     =========================================================== */
  async function handlePriorityChange(
    item: EventChecklistItemDto,
    priority: ChecklistItemPriority
  ) {
    try {
      await updateEventChecklistItem(eventId, item.id, { priority });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, priority } : i))
      );
    } catch {
      alert("Errore durante l'aggiornamento della priorità");
    }
  }

  /* ===========================================================
     📝 Update notes
     =========================================================== */
  async function handleNotesChange(item: EventChecklistItemDto, notes: string) {
    try {
      await updateEventChecklistItem(eventId, item.id, { notes });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, notes } : i))
      );
    } catch {
      alert("Errore durante il salvataggio delle note");
    }
  }

  /* ===========================================================
     🗑 Delete item
     =========================================================== */
  async function handleDelete(itemId: number) {
    if (!confirm("Eliminare questa voce dalla checklist?")) return;

    try {
      await deleteEventChecklistItem(eventId, itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      alert("Errore durante l'eliminazione dell'elemento");
    }
  }

  /* ===========================================================
     📄 Render
     =========================================================== */
  return (
    <ComponentCard title="Checklist Evento">
      {/* Barra di aggiunta nuova voce */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            placeholder="Aggiungi una nuova voce..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-80"
          />

          <select
            className="border rounded-lg px-2 py-2 text-sm"
            value={newPriority}
            onChange={(e) =>
              setNewPriority(Number(e.target.value) as ChecklistItemPriority)
            }
          >
            <option value={ChecklistItemPriority.High}>Alta 🔥</option>
            <option value={ChecklistItemPriority.Medium}>Media ⭐</option>
            <option value={ChecklistItemPriority.Low}>Bassa •</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            startIcon={<PlusIcon className="size-4" />}
            onClick={handleAdd}
          >
            Aggiungi
          </Button>
        </div>

        {/* Note per nuova voce */}
        <textarea
          placeholder="Note per questa voce (opzionale)..."
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          className="border rounded-lg px-3 py-2 text-xs w-full sm:w-[32rem]"
        />
      </div>

      {/* Tabella / stato */}
      {loading ? (
        <div className="text-gray-500 text-sm">Caricamento checklist...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-sm">
          Nessun elemento presente. Aggiungi una voce sopra.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Voce</TableCell>
                  <TableCell isHeader>Priorità</TableCell>
                  <TableCell isHeader>Stato</TableCell>
                  <TableCell isHeader>Note</TableCell>
                  <TableCell isHeader className="text-center">
                    Azioni
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`${getRowClass(item)} transition-colors`}
                  >
                    {/* Etichetta (dal template) */}
                    <TableCell>{item.templateTitle}</TableCell>

                    {/* Priorità: badge + select */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderPriorityBadge(item.priority)}
                        <select
                          className="border rounded-lg px-2 py-1 text-xs"
                          value={item.priority}
                          onChange={(e) =>
                            handlePriorityChange(
                              item,
                              Number(e.target.value) as ChecklistItemPriority
                            )
                          }
                        >
                          <option value={ChecklistItemPriority.High}>
                            Alta
                          </option>
                          <option value={ChecklistItemPriority.Medium}>
                            Media
                          </option>
                          <option value={ChecklistItemPriority.Low}>
                            Bassa
                          </option>
                        </select>
                      </div>
                    </TableCell>

                    {/* Stato: dropdown */}
                    <TableCell>
                      <select
                        className="border rounded-lg px-2 py-1 text-sm"
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item,
                            Number(e.target.value) as ChecklistItemStatus
                          )
                        }
                      >
                        <option value={ChecklistItemStatus.Todo}>Da fare</option>
                        <option value={ChecklistItemStatus.Done}>Fatto</option>
                        <option value={ChecklistItemStatus.NotNeeded}>
                          Non necessario
                        </option>
                      </select>
                    </TableCell>

                    {/* Note */}
                    <TableCell>
                      <textarea
                        className="border rounded-lg px-2 py-1 text-xs w-64"
                        value={item.notes || ""}
                        onChange={(e) =>
                          handleNotesChange(item, e.target.value)
                        }
                      />
                    </TableCell>

                    {/* Azioni */}
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        startIcon={
                          <TrashIcon className="size-4 text-red-500" />
                        }
                        onClick={() => handleDelete(item.id)}
                      >
                        Elimina
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </ComponentCard>
  );
}
