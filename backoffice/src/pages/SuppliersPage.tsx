import { useState } from 'react';
import { Plus, Truck } from 'lucide-react';
import {
  useGetSuppliersQuery,
  useDeleteSupplierMutation,
} from '@features/suppliers/api/suppliersApi';
import { SupplierFormModal } from '@features/suppliers/components/SupplierFormModal';
import { DataTable, type Column } from '@shared/components/ui/DataTable';
import { Button } from '@shared/components/ui/Button';
import { Modal } from '@shared/components/ui/Modal';
import type { Supplier } from '@shared/types/common';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

const LIMIT = 20;

export function SuppliersPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching, refetch } = useGetSuppliersQuery({ limit: LIMIT, cursor });
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation();

  const suppliers = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const [formOpen, setFormOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const handleEdit = (supplier: Supplier) => {
    setEditSupplier(supplier);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditSupplier(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditSupplier(null);
    setCursor(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSupplier(deleteTarget.id).unwrap();
      toast.success('Proveedor eliminado.');
      setCursor(undefined);
    } catch {
      toast.error('Error al eliminar el proveedor.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      sortValue: (s) => s.name,
      render: (s) => <span className="font-medium text-on-surface">{s.name}</span>,
    },
    {
      key: 'contactName',
      header: 'Contacto',
      render: (s) => <span>{s.contactName}</span>,
    },
    {
      key: 'email',
      header: 'Correo',
      render: (s) => <span className="text-on-surface-variant">{s.email}</span>,
    },
    {
      key: 'phone',
      header: 'Teléfono',
      render: (s) => <span>{s.phone}</span>,
    },
    {
      key: 'isActive',
      header: 'Estado',
      align: 'center',
      render: (s) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            s.isActive
              ? 'bg-[#ddfbf2] text-[#006b58]'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {s.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleEdit(s)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="Editar"
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(s)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-on-surface-variant hover:bg-red-50 hover:text-error transition-colors"
            title="Eliminar"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <Truck size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
            Proveedores
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Gestión de proveedores de productos deportivos
          </p>
        </div>
      </div>

      <DataTable
        data={suppliers}
        columns={columns}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        title="Proveedores"
        totalLabel="proveedores"
        searchPlaceholder="Buscar proveedor..."
        searchFilter={(s, q) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.contactName.toLowerCase().includes(q)
        }
        emptyTitle="Sin proveedores"
        emptyDescription="Aún no hay proveedores registrados."
        emptyIcon={Truck}
        onRefresh={() => refetch()}
        actions={
          <Button size="sm" onClick={handleCreate}>
            <Plus size={14} />
            Nuevo Proveedor
          </Button>
        }
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />

      <SupplierFormModal isOpen={formOpen} onClose={handleCloseForm} supplier={editSupplier} />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar proveedor"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} isLoading={isDeleting}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-body-md text-on-surface-variant">
          ¿Estás seguro de que deseas eliminar{' '}
          <span className="font-semibold text-on-surface">{deleteTarget?.name}</span>? Esta acción
          no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}
