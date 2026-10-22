import { X, PackageSearch } from 'lucide-react';
import { useState } from 'react';
import type { StockAlertItem } from '@features/inventory/api/inventoryApi';

interface Props {
  items: StockAlertItem[];
}

export function LowStockAlert({ items }: Readonly<Props>) {
  const [dismissed, setDismissed] = useState(false);

  if (items.length === 0 || dismissed) return null;

  const visible = items.slice(0, 8);
  const remaining = items.length - 8;

  return (
    <div className="bg-white border border-outline-variant rounded-xl shadow-soft">
      <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold tracking-tight text-on-surface">
            Alertas de inventario
          </p>
          <p className="text-label-md text-on-surface-variant mt-0.5">
            Stock crítico · excluye productos cubiertos por compras pendientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
            {items.length}
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Cerrar alerta"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {visible.map((item) => {
            const isOut = item.status === 'out';
            const isNew = item.status === 'new';
            const pct = isOut || isNew
              ? 0
              : item.minStock > 0
                ? Math.round((item.stock / item.minStock) * 100)
                : 100;

            const dotColor = isOut ? 'bg-red-500' : isNew ? 'bg-blue-500' : 'bg-amber-400';
            const barColor = isOut ? 'bg-red-400' : isNew ? 'bg-blue-400' : 'bg-amber-400';
            const textColor = isOut ? 'text-red-600' : isNew ? 'text-blue-600' : 'text-amber-600';

            const label = isOut
              ? 'Agotado'
              : isNew
                ? 'Nuevo'
                : `${item.stock} / ${item.minStock}`;

            return (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span className="text-body-md text-on-surface truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {item.incomingQty > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                        <PackageSearch size={11} />
                        +{item.incomingQty}
                      </span>
                    )}
                    <span className={`text-label-md font-semibold tabular-nums ${textColor}`}>
                      {label}
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-surface-container-high rounded-full overflow-hidden ml-3.5">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {remaining > 0 && (
          <p className="text-body-md text-on-surface-variant text-center mt-4">
            + {remaining} producto{remaining !== 1 ? 's' : ''} más con stock bajo
          </p>
        )}
      </div>
    </div>
  );
}
