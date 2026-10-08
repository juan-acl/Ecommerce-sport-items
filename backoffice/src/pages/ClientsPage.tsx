import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetClientsQuery, useDeleteClientMutation } from '@features/clients/api/clientsApi';
import { ClientsTable } from '@features/clients/components/ClientsTable';
import { ClientFormModal } from '@features/clients/components/ClientFormModal';
import { Button } from '@shared/components/ui/Button';
import { Modal } from '@shared/components/ui/Modal';
import type { User } from '@shared/types/common';
import { toast } from 'sonner';

const LIMIT = 20;

export function ClientsPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching } = useGetClientsQuery({ limit: LIMIT, cursor });
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const clients = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const [formOpen, setFormOpen] = useState(false);
  const [editClient, setEditClient] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const resetPagination = () => setCursor(undefined);

  const handleEdit = (client: User) => {
    setEditClient(client);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditClient(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditClient(null);
    resetPagination();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteClient(deleteTarget.id).unwrap();
      toast.success(`Cliente "${deleteTarget.name}" desactivado correctamente.`);
      resetPagination();
    } catch {
      toast.error('No se pudo desactivar el cliente. Intenta de nuevo.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-md text-on-surface">Clientes</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Gestión de clientes registrados
        </p>
      </div>

      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        actions={
          <Button size="sm" onClick={handleCreate}>
            <Plus size={14} />
            Nuevo Cliente
          </Button>
        }
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />

      <ClientFormModal isOpen={formOpen} onClose={handleCloseForm} client={editClient} />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Desactivar cliente"
      >
        <p className="text-body-md text-on-surface-variant">
          ¿Confirmas la desactivación de{' '}
          <span className="font-semibold text-on-surface">{deleteTarget?.name}</span>?
        </p>
        <p className="text-body-md text-on-surface-variant mt-1">
          El cliente no podrá iniciar sesión ni realizar compras. Sus órdenes previas se
          conservan. Esta acción no elimina los datos permanentemente.
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
