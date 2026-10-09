import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '@features/users/api/usersApi';
import { UsersTable } from '@features/users/components/UsersTable';
import { UserFormModal } from '@features/users/components/UserFormModal';
import { Button } from '@shared/components/ui/Button';
import { Modal } from '@shared/components/ui/Modal';
import type { User } from '@shared/types/common';
import { toast } from 'sonner';

const LIMIT = 20;

export function UsersPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching } = useGetUsersQuery({ limit: LIMIT, cursor });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const resetPagination = () => setCursor(undefined);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditUser(null);
    resetPagination();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      toast.success(`Usuario "${deleteTarget.name}" desactivado correctamente.`);
      resetPagination();
    } catch {
      toast.error('No se pudo desactivar el usuario. Intenta de nuevo.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <Users size={20} strokeWidth={1.75} />
        </div>
        <div>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">Usuarios</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">
          Gestión de usuarios del sistema
        </p>
      </div>
      </div>

      <UsersTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        actions={
          <Button size="sm" onClick={handleCreate}>
            <Plus size={14} />
            Nuevo Usuario
          </Button>
        }
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />

      <UserFormModal isOpen={formOpen} onClose={handleCloseForm} user={editUser} />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Desactivar usuario"
      >
        <p className="text-body-md text-on-surface-variant">
          ¿Confirmas la desactivación de{' '}
          <span className="font-semibold text-on-surface">{deleteTarget?.name}</span>?
        </p>
        <p className="text-body-md text-on-surface-variant mt-1">
          El usuario no podrá iniciar sesión y dejará de aparecer en el sistema. Esta acción no
          elimina los datos permanentemente.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} isLoading={isDeleting}>
            Desactivar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
