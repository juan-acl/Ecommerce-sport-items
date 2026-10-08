import type { ReactNode } from 'react';
import { Pencil, Trash2, Package } from 'lucide-react';
import type { Product } from '@shared/types/common';
import { DataTable, type Column, type ServerPagination } from '@shared/components/ui/DataTable';
import { Button } from '@shared/components/ui/Button';
import { formatCurrency } from '@shared/utils/formatCurrency';

interface ProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  actions?: ReactNode;
  serverPagination?: ServerPagination;
}

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  actions,
  serverPagination,
}: Readonly<ProductsTableProps>) {
  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Producto',
      sortable: true,
      sortValue: (p) => p.name.toLowerCase(),
      render: (p) => (
        <div className="flex items-center gap-3">
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-9 h-9 rounded-md object-cover bg-surface-container flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-9 h-9 rounded-md bg-surface-container flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-on-surface">{p.name}</p>
            <p className="text-label-md text-on-surface-variant truncate max-w-[220px]">
              {p.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      sortable: true,
      sortValue: (p) => p.category,
      render: (p) => (
        <span className="capitalize text-on-surface-variant">{p.category}</span>
      ),
    },
    {
      key: 'price',
      header: 'Precio',
      align: 'right',
      sortable: true,
      sortValue: (p) => p.price,
      render: (p) => <span className="font-medium">{formatCurrency(p.price)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'center',
      sortable: true,
      sortValue: (p) => p.stock,
      render: (p) => (
        <span className={p.stock <= p.minStock ? 'text-error font-semibold' : 'text-on-surface'}>
          {p.stock}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      width: '90px',
      render: (p) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(p)}
            className="h-7 w-7 p-0 rounded-md"
            title="Editar"
          >
            <Pencil size={13} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(p)}
            className="h-7 w-7 p-0 rounded-md"
            title="Eliminar"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={products}
      columns={columns}
      keyExtractor={(p) => p.id}
      isLoading={isLoading}
      title="Productos"
      totalLabel="productos"
      actions={actions}
      searchFilter={(p, q) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      }
      searchPlaceholder="Buscar producto o categoría..."
      emptyTitle="No hay productos"
      emptyDescription="Agrega el primer producto al catálogo."
      emptyIcon={Package}
      serverPagination={serverPagination}
    />
  );
}
