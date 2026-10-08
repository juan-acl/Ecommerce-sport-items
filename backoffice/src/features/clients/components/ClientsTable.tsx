import type { ReactNode } from "react";
import { Pencil, UserX, UserCheck } from "lucide-react";
import type { User } from "@shared/types/common";
import {
  DataTable,
  type Column,
  type ServerPagination,
} from "@shared/components/ui/DataTable";
import { Button } from "@shared/components/ui/Button";

interface ClientsTableProps {
  clients: User[];
  isLoading?: boolean;
  onEdit: (client: User) => void;
  onDelete: (client: User) => void;
  actions?: ReactNode;
  serverPagination?: ServerPagination;
}

export function ClientsTable({
  clients,
  isLoading,
  onEdit,
  onDelete,
  actions,
  serverPagination,
}: Readonly<ClientsTableProps>) {
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Cliente",
      sortable: true,
      sortValue: (c) => c.name.toLowerCase(),
      render: (c) => (
        <div>
          <p className="font-medium text-on-surface">{c.name}</p>
          <p className="text-label-md text-on-surface-variant font-mono">
            {c.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      sortValue: (c) => c.email,
      render: (c) => <span className="text-on-surface-variant">{c.email}</span>,
    },
    {
      key: "createdAt",
      header: "Registrado",
      sortable: true,
      sortValue: (c) => c.createdAt,
      render: (c) => (
        <span className="text-on-surface-variant">
          {new Date(c.createdAt).toLocaleDateString("es-GT")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      width: "96px",
      render: (c) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(c)}
            className="h-7 w-7 p-0 rounded-md"
            title="Editar"
          >
            <Pencil size={13} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(c)}
            className="h-7 w-7 p-0 rounded-md text-error border-error/30 hover:bg-error-container"
            title="Desactivar cliente"
          >
            <UserX size={13} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={clients}
      columns={columns}
      keyExtractor={(c) => c.id}
      isLoading={isLoading}
      title="Clientes"
      totalLabel="clientes"
      actions={actions}
      searchFilter={(c, q) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      }
      searchPlaceholder="Buscar por nombre o email..."
      emptyTitle="No hay clientes"
      emptyDescription="Agrega el primer cliente al sistema."
      emptyIcon={UserCheck}
      serverPagination={serverPagination}
    />
  );
}
