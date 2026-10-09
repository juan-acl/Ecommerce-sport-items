import { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '@features/products/api/productsApi';
import { ProductsTable } from '@features/products/components/ProductsTable';
import { ProductFormModal } from '@features/products/components/ProductFormModal';
import { Button } from '@shared/components/ui/Button';
import { Modal } from '@shared/components/ui/Modal';
import type { Product } from '@shared/types/common';
import { toast } from 'sonner';

const LIMIT = 10;

export function ProductsPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching } = useGetProductsQuery({ limit: LIMIT, cursor });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = data?.items ?? [];
  const hasMore = !!data?.nextCursor;

  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const resetPagination = () => setCursor(undefined);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditProduct(null);
    resetPagination();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id).unwrap();
      toast.success('Producto eliminado.');
      resetPagination();
    } catch {
      toast.error('Error al eliminar el producto.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <Package size={20} strokeWidth={1.75} />
        </div>
        <div>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">Productos</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">
          Gestión del catálogo de productos deportivos
        </p>
      </div>
      </div>

      <ProductsTable
        products={products}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        actions={
          <Button size="sm" onClick={handleCreate}>
            <Plus size={14} />
            Nuevo Producto
          </Button>
        }
        serverPagination={{
          hasMore,
          onLoadMore: () => setCursor(data?.nextCursor),
          isLoading: isFetching,
        }}
      />

      <ProductFormModal isOpen={formOpen} onClose={handleCloseForm} product={editProduct} />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar producto"
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
