import { useMemo } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  ArrowRight,
  BarChart2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@features/products/api/productsApi";
import { useGetOrdersQuery } from "@features/orders/api/ordersApi";
import { useGetUsersQuery } from "@features/users/api/usersApi";
import { Badge } from "@shared/components/ui/Badge";
import { Spinner } from "@shared/components/ui/Spinner";
import { formatCurrency } from "@shared/utils/formatCurrency";
import type { OrderStatus } from "@shared/types/common";
import { ROUTES } from "@shared/constants/routes";

const STATUS_VARIANTS: Record<
  OrderStatus,
  "warning" | "success" | "info" | "error"
> = {
  pending: "warning",
  paid: "success",
  shipped: "info",
  cancelled: "error",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; bar: string }
> = {
  pending: { color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-400" },
  paid: {
    color: "text-secondary",
    bg: "bg-secondary-container",
    bar: "bg-secondary",
  },
  shipped: { color: "text-primary", bg: "bg-primary-container", bar: "bg-primary" },
  cancelled: { color: "text-red-500", bg: "bg-red-50", bar: "bg-red-400" },
};

const CATEGORY_LABELS: Record<string, string> = {
  running: "Running",
  football: "Fútbol",
  basketball: "Baloncesto",
  tennis: "Tenis",
  swimming: "Natación",
  cycling: "Ciclismo",
  fitness: "Fitness",
  other: "Otros",
};

export function DashboardPage() {
  const { data: productsData, isLoading: lp } = useGetProductsQuery({
    limit: 100,
  });
  const { data: ordersData, isLoading: lo } = useGetOrdersQuery({ limit: 100 });
  const { data: usersData, isLoading: lu } = useGetUsersQuery({ limit: 100 });

  const products = productsData?.items ?? [];
  const orders = ordersData?.items ?? [];
  const users = usersData?.items ?? [];

  const m = useMemo(() => {
    const confirmedOrders = orders.filter(
      (o) => o.status === "paid" || o.status === "shipped",
    );
    const totalRevenue = confirmedOrders.reduce((s, o) => s + o.total, 0);
    const avgTicket = confirmedOrders.length
      ? totalRevenue / confirmedOrders.length
      : 0;
    const conversionRate = orders.length
      ? Math.round((confirmedOrders.length / orders.length) * 100)
      : 0;
    const pendingRevenue = orders
      .filter((o) => o.status === "pending")
      .reduce((s, o) => s + o.total, 0);

    const byStatus = {
      pending: orders.filter((o) => o.status === "pending"),
      paid: orders.filter((o) => o.status === "paid"),
      shipped: orders.filter((o) => o.status === "shipped"),
      cancelled: orders.filter((o) => o.status === "cancelled"),
    };

    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const date = d.toISOString().split("T")[0];
      const dayOrders = orders.filter((o) => o.createdAt.startsWith(date));
      return {
        label: d.toLocaleDateString("es-GT", { weekday: "short" }),
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((o) => o.status === "paid" || o.status === "shipped")
          .reduce((s, o) => s + o.total, 0),
      };
    });
    const maxDayRevenue = Math.max(...days.map((d) => d.revenue), 1);

    const productMap = new Map<
      string,
      { name: string; units: number; revenue: number }
    >();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const p = productMap.get(item.productId) ?? {
          name: item.productName,
          units: 0,
          revenue: 0,
        };
        productMap.set(item.productId, {
          name: item.productName,
          units: p.units + item.quantity,
          revenue: p.revenue + item.subtotal,
        });
      });
    });
    const topProducts = [...productMap.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    const maxProdRevenue = topProducts[0]?.revenue ?? 1;

    const custMap = new Map<
      string,
      { label: string; orderCount: number; total: number }
    >();
    orders.forEach((order) => {
      const prev = custMap.get(order.userId) ?? {
        label: order.userEmail ?? `…${order.userId.slice(-6)}`,
        orderCount: 0,
        total: 0,
      };
      custMap.set(order.userId, {
        label: prev.label,
        orderCount: prev.orderCount + 1,
        total: prev.total + order.total,
      });
    });
    const topCustomers = [...custMap.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
    const maxCustTotal = topCustomers[0]?.total ?? 1;

    const catMap = new Map<string, number>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const cat =
          products.find((p) => p.id === item.productId)?.category ?? "other";
        catMap.set(cat, (catMap.get(cat) ?? 0) + item.subtotal);
      });
    });
    const categoryRows = [...catMap.entries()].sort((a, b) => b[1] - a[1]);
    const totalCatRev = categoryRows.reduce((s, [, r]) => s + r, 0);

    const outOfStock = products.filter((p) => p.stock === 0);
    const lowStock = products.filter(
      (p) => p.stock > 0 && p.stock <= p.minStock,
    );

    const clientCount = users.filter((u) => u.role === "client").length;

    const actionOrders = [...byStatus.pending]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6);

    return {
      totalRevenue,
      avgTicket,
      conversionRate,
      pendingRevenue,
      confirmedOrders,
      byStatus,
      clientCount,
      days,
      maxDayRevenue,
      topProducts,
      maxProdRevenue,
      topCustomers,
      maxCustTotal,
      categoryRows,
      totalCatRev,
      outOfStock,
      lowStock,
      actionOrders,
    };
  }, [orders, products, users]);

  if (lo || lp || lu) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const statusKeys: OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <LayoutDashboard size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">Dashboard</h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">Vista general de operaciones</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ingresos confirmados"
          value={formatCurrency(m.totalRevenue)}
          sub={`${m.confirmedOrders.length} órdenes · conv. ${m.conversionRate}%`}
          icon={<TrendingUp size={18} strokeWidth={1.75} />}
          iconClass="bg-[#ddfbf2] text-[#006b58]"
        />
        <KpiCard
          label="Ticket promedio"
          value={formatCurrency(m.avgTicket)}
          sub={
            m.pendingRevenue > 0
              ? `${formatCurrency(m.pendingRevenue)} en pendientes`
              : "Sin pendientes"
          }
          icon={<BarChart2 size={18} strokeWidth={1.75} />}
          iconClass="bg-[#e0f7f8] text-[#0e8a94]"
        />
        <KpiCard
          label="Clientes registrados"
          value={String(m.clientCount)}
          sub={`${orders.length} órdenes en total`}
          icon={<Users size={18} strokeWidth={1.75} />}
          iconClass="bg-[#ddfbf2] text-[#006b58]"
        />
        <KpiCard
          label="Alertas de inventario"
          value={String(m.outOfStock.length + m.lowStock.length)}
          sub={
            m.outOfStock.length > 0
              ? `${m.outOfStock.length} sin stock · ${m.lowStock.length} stock bajo`
              : m.lowStock.length > 0
                ? `${m.lowStock.length} con stock bajo`
                : "Inventario saludable"
          }
          icon={<AlertCircle size={18} strokeWidth={1.75} />}
          iconClass={
            m.outOfStock.length > 0
              ? "bg-error-container text-error"
              : m.lowStock.length > 0
                ? "bg-amber-50 text-amber-600"
                : "bg-[#e0f7f8] text-[#0e8a94]"
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 bg-white border border-outline-variant rounded-xl shadow-soft">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold tracking-tight text-on-surface">
                Tendencia — últimos 7 días
              </p>
              <p className="text-label-md text-on-surface-variant mt-0.5">
                Ingresos confirmados por día
              </p>
            </div>
            <span className="text-headline-sm font-bold text-on-surface tabular-nums">
              {formatCurrency(m.totalRevenue)}
            </span>
          </div>
          <div className="px-5 py-5">
            <div className="flex items-end gap-2 h-28">
              {m.days.map((day, i) => {
                const pct =
                  m.maxDayRevenue > 0
                    ? Math.max(
                        (day.revenue / m.maxDayRevenue) * 100,
                        day.revenue > 0 ? 4 : 0,
                      )
                    : 0;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1.5"
                    title={formatCurrency(day.revenue)}
                  >
                    <div
                      className="w-full flex flex-col justify-end"
                      style={{ height: "88px" }}
                    >
                      <div
                        className={`w-full rounded-t transition-all ${day.revenue > 0 ? "bg-primary" : "bg-outline-variant/40"}`}
                        style={{
                          height: `${pct}%`,
                          minHeight: day.orders > 0 ? "4px" : "0",
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[10px] font-medium text-on-surface-variant capitalize">
                        {day.label}
                      </span>
                      {day.orders > 0 && (
                        <span className="text-[9px] text-on-surface-variant/60 tabular-nums">
                          {day.orders}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-6 flex-wrap">
              <Stat
                label="Órdenes confirmadas"
                value={String(m.confirmedOrders.length)}
              />
              <Stat label="Tasa de conversión" value={`${m.conversionRate}%`} />
              <Stat
                label="Valor pendiente"
                value={formatCurrency(m.pendingRevenue)}
                muted={m.pendingRevenue === 0}
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 bg-white border border-outline-variant rounded-xl shadow-soft">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant">
            <p className="text-[14px] font-semibold tracking-tight text-on-surface">
              Pipeline de órdenes
            </p>
            <p className="text-label-md text-on-surface-variant mt-0.5">
              {orders.length} en total
            </p>
          </div>
          <div className="p-5 space-y-3">
            {orders.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-4 text-center">
                Sin órdenes.
              </p>
            ) : (
              <>
                <div className="flex h-2 rounded-full overflow-hidden gap-px">
                  {statusKeys.map((s) => {
                    const pct = orders.length
                      ? (m.byStatus[s].length / orders.length) * 100
                      : 0;
                    return pct > 0 ? (
                      <div
                        key={s}
                        className={STATUS_CONFIG[s].bar}
                        style={{ width: `${pct}%` }}
                      />
                    ) : null;
                  })}
                </div>

                <div className="space-y-2 pt-1">
                  {statusKeys.map((s) => {
                    const count = m.byStatus[s].length;
                    const pct = orders.length
                      ? Math.round((count / orders.length) * 100)
                      : 0;
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <div
                        key={s}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.bar}`}
                          />
                          <span className="text-body-md text-on-surface-variant truncate">
                            {STATUS_LABELS[s]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="w-16 bg-surface-container rounded-full h-1 overflow-hidden">
                            <div
                              className={`h-full ${cfg.bar} rounded-full`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-body-md font-semibold text-on-surface tabular-nums w-5 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {m.byStatus.pending.length > 0 && (
                  <div className="pt-2 mt-1 border-t border-outline-variant flex items-center justify-between">
                    <span className="text-body-md text-amber-600 font-medium">
                      {m.byStatus.pending.length} requieren atención
                    </span>
                    <Link
                      to={ROUTES.ORDERS}
                      className="text-body-md text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Gestionar
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 bg-white border border-outline-variant rounded-xl shadow-soft">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold tracking-tight text-on-surface">
                Productos más vendidos
              </p>
              <p className="text-label-md text-on-surface-variant mt-0.5">
                Por ingresos acumulados
              </p>
            </div>
            <ShoppingCart size={16} className="text-on-surface-variant" />
          </div>
          <div className="p-5">
            {m.topProducts.length === 0 ? (
              <EmptyState
                icon={<Package size={28} />}
                label="Sin datos de ventas aún."
              />
            ) : (
              <div className="space-y-4">
                {m.topProducts.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-body-md text-on-surface font-medium truncate">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="text-label-md text-on-surface-variant tabular-nums">
                          {p.units} uds.
                        </span>
                        <span className="text-body-md font-semibold text-on-surface tabular-nums min-w-[76px] text-right">
                          {formatCurrency(p.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-surface-container-high rounded-full overflow-hidden ml-7">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(p.revenue / m.maxProdRevenue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-5 bg-white border border-outline-variant rounded-xl shadow-soft">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold tracking-tight text-on-surface">
                Mejores clientes
              </p>
              <p className="text-label-md text-on-surface-variant mt-0.5">
                Por gasto total acumulado
              </p>
            </div>
            <Users size={16} className="text-on-surface-variant" />
          </div>
          <div className="p-5">
            {m.topCustomers.length === 0 ? (
              <EmptyState
                icon={<Users size={28} />}
                label="Sin órdenes registradas."
              />
            ) : (
              <div className="space-y-4">
                {m.topCustomers.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#ddfbf2] text-[#006b58] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {c.label[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-body-md text-on-surface truncate">
                          {c.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-label-md text-on-surface-variant tabular-nums">
                          {c.orderCount} ord.
                        </span>
                        <span className="text-body-md font-semibold text-on-surface tabular-nums min-w-[72px] text-right">
                          {formatCurrency(c.total)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-surface-container-high rounded-full overflow-hidden ml-8">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{
                          width: `${(c.total / m.maxCustTotal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-6 bg-white border border-outline-variant rounded-xl shadow-soft">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant">
            <p className="text-[14px] font-semibold tracking-tight text-on-surface">
              Ingresos por categoría
            </p>
            <p className="text-label-md text-on-surface-variant mt-0.5">
              Distribución de ventas por segmento
            </p>
          </div>
          <div className="p-5">
            {m.categoryRows.length === 0 ? (
              <EmptyState
                icon={<BarChart2 size={28} />}
                label="Sin datos de ventas aún."
              />
            ) : (
              <div className="space-y-3.5">
                {m.categoryRows.map(([cat, rev]) => {
                  const pct = m.totalCatRev
                    ? Math.round((rev / m.totalCatRev) * 100)
                    : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-body-md text-on-surface">
                          {CATEGORY_LABELS[cat] ?? cat}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-label-md text-on-surface-variant tabular-nums">
                            {pct}%
                          </span>
                          <span className="text-body-md font-semibold text-on-surface tabular-nums min-w-[72px] text-right">
                            {formatCurrency(rev)}
                          </span>
                        </div>
                      </div>
                      <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-6 bg-white border border-outline-variant rounded-xl shadow-soft">
          <div className="px-5 pt-4 pb-3.5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold tracking-tight text-on-surface">
                Alertas de inventario
              </p>
              <p className="text-label-md text-on-surface-variant mt-0.5">
                Productos con stock crítico o agotado
              </p>
            </div>
            {m.outOfStock.length + m.lowStock.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                {m.outOfStock.length + m.lowStock.length}
              </span>
            )}
          </div>
          <div className="p-5">
            {m.outOfStock.length === 0 && m.lowStock.length === 0 ? (
              <div className="flex items-center gap-3 py-4">
                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                <p className="text-body-md text-on-surface-variant">
                  Todos los productos tienen stock suficiente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...m.outOfStock, ...m.lowStock].slice(0, 6).map((p) => {
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
                {m.outOfStock.length + m.lowStock.length > 6 && (
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="inline-flex items-center gap-1 text-body-md text-primary hover:underline mt-1"
                  >
                    Ver {m.outOfStock.length + m.lowStock.length - 6} más
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {m.actionOrders.length > 0 && (
        <div className="bg-white border border-outline-variant rounded-xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant">
            <div>
              <p className="text-[14px] font-semibold tracking-tight text-on-surface">
                Órdenes pendientes de atención
              </p>
              <p className="text-label-md text-on-surface-variant mt-0.5">
                Sin procesar — ordenadas por fecha de recepción
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {m.byStatus.pending.length}
              </span>
              <Link
                to={ROUTES.ORDERS}
                className="inline-flex items-center gap-1 text-body-md text-primary hover:underline"
              >
                Ver todas
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-body-md border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  {[
                    "Orden",
                    "Cliente",
                    "Productos",
                    "Monto",
                    "Fecha",
                    "Estado",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {m.actionOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/60 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant max-w-[180px] truncate">
                      {order.userEmail ?? order.userId}
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant tabular-nums">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} pzs.
                    </td>
                    <td className="px-5 py-3 font-semibold tabular-nums">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("es-GT")}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_VARIANTS[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="group bg-white border border-outline-variant rounded-xl shadow-soft p-5 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(17,28,45,0.18)]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-on-surface-variant">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-[26px] leading-none font-bold tracking-[-0.02em] text-on-surface tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-on-surface-variant">{sub}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="text-label-md text-on-surface-variant">{label}</p>
      <p
        className={`text-body-md font-semibold tabular-nums ${muted ? "text-on-surface-variant" : "text-on-surface"}`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <span className="text-on-surface-variant opacity-20">{icon}</span>
      <p className="text-body-md text-on-surface-variant">{label}</p>
    </div>
  );
}
