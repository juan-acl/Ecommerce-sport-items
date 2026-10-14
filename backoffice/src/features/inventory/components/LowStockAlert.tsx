import { X } from "lucide-react";
import { useState } from "react";
import type { Product } from "@shared/types/common";

interface Props {
  products: Product[];
}

export function LowStockAlert({ products }: Readonly<Props>) {
  const [dismissed, setDismissed] = useState(false);

  if (products.length === 0 || dismissed) return null;

  const visible = products.slice(0, 8);
  const remaining = products.length - 8;

  return (
    <div className="bg-white border border-outline-variant rounded-xl shadow-soft">
      <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold tracking-tight text-on-surface">
            Alertas de inventario
          </p>
          <p className="text-label-md text-on-surface-variant mt-0.5">
            Productos con stock crítico o agotado
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
            {products.length}
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
          {visible.map((p) => {
            const isOut = p.stock === 0;
            const pct = isOut
              ? 0
              : p.minStock > 0
                ? Math.round((p.stock / p.minStock) * 100)
                : 100;
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${isOut ? "bg-red-500" : "bg-amber-400"}`}
                    />
                    <span
                      className="text-body-md text-on-surface truncate"
                      title={p.name}
                    >
                      {p.name}
                    </span>
                  </div>
                  <span
                    className={`text-label-md font-semibold tabular-nums flex-shrink-0 ml-2 ${isOut ? "text-red-600" : "text-amber-600"}`}
                  >
                    {isOut ? "Agotado" : `${p.stock} / ${p.minStock}`}
                  </span>
                </div>
                <div className="h-1 bg-surface-container-high rounded-full overflow-hidden ml-3.5">
                  <div
                    className={`h-full rounded-full ${isOut ? "bg-red-400" : "bg-amber-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {remaining > 0 && (
          <p className="text-body-md text-on-surface-variant text-center mt-4">
            + {remaining} producto{remaining !== 1 ? "s" : ""} más con stock
            bajo
          </p>
        )}
      </div>
    </div>
  );
}
