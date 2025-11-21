// src/pages/planners/PlannerList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlanners, deletePlanner } from "../../services/plannersApi";
import { PlannerListItemDto, PlannerType } from "../../types/Planner";

import {
  Table, TableHeader, TableBody, TableRow, TableCell
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "lucide-react";

export default function PlannerList() {
  const [items, setItems] = useState<PlannerListItemDto[]>([]);

  async function load() {
    const data = await getPlanners();
    setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Eliminare questo planner?")) return;
    await deletePlanner(id);
    load();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planner</h1>

        <Link to="/planners/new">
          <Button startIcon={<PlusIcon className="size-4" />}>Nuovo</Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Nome</TableCell>
              <TableCell isHeader>Azienda</TableCell>
              <TableCell isHeader>Tipo</TableCell>
              <TableCell isHeader className="text-center">
                Azioni
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.fullName}</TableCell>
                <TableCell>{p.companyName || "-"}</TableCell>
                <TableCell>{PlannerType[p.type]}</TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Link to={`/planners/${p.id}`}>
                      <Button size="sm" variant="outline">
                        <EyeIcon className="size-4" />
                      </Button>
                    </Link>

                    <Link to={`/planners/${p.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <PencilIcon className="size-4" />
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(p.id)}
                    >
                      <TrashIcon className="size-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
