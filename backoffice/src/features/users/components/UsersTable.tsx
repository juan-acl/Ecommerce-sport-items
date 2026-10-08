import type { ReactNode } from 'react';
import { Pencil, UserX, Users } from 'lucide-react';
import type { User } from '@shared/types/common';
import { DataTable, type Column, type ServerPagination } from '@shared/components/ui/DataTable';
import { Button } from '@shared/components/ui/Button';
import { Badge } from '@shared/components/ui/Badge';

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  actions?: ReactNode;
  serverPagination?: ServerPagination;
}

export function UsersTable({
  users,
  isLoading,
  onEdit,
  onDelete,
  actions,
  serverPagination,
}: Readonly<UsersTableProps>) {
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      sortValue: (u) => u.name.toLowerCase(),
      render: (u) => (
        <div>
          <p className="font-medium text-on-surface">{u.name}</p>
          <p className="text-label-md text-on-surface-variant font-mono">
            {u.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      sortValue: (u) => u.email,
      render: (u) => <span className="text-on-surface-variant">{u.email}</span>,
    },
    {
      key: 'role',
      header: 'Rol',
      sortable: true,
      sortValue: (u) => u.role,
      render: (u) => (
        <Badge variant={u.role === 'admin' ? 'info' : 'default'}>
          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registrado',
      sortable: true,
      sortValue: (u) => u.createdAt,
      render: (u) => (
        <span className="text-on-surface-variant">
          {new Date(u.createdAt).toLocaleDateString('es-GT')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '96px',
      render: (u) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(u)}
            className="h-7 w-7 p-0 rounded-md"
            title="Editar"
          >
            <Pencil size={13} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(u)}
            className="h-7 w-7 p-0 rounded-md text-error border-error/30 hover:bg-error-container"
            title="Desactivar usuario"
          >
            <UserX size={13} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      keyExtractor={(u) => u.id}
      isLoading={isLoading}
      title="Usuarios"
      totalLabel="usuarios"
      actions={actions}
      searchFilter={(u, q) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      }
      searchPlaceholder="Buscar por nombre o email..."
      emptyTitle="No hay usuarios"
      emptyDescription="Agrega el primer usuario al sistema."
      emptyIcon={Users}
      serverPagination={serverPagination}
    />
  );
}
