import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  ShoppingBag,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@shared/utils/cn";
import { ROUTES } from "@shared/constants/routes";
import { useAppSelector } from "@app/hooks";
import { selectPermissions } from "@features/auth/store/authSlice";
import type { ModulePermission } from "@shared/types/common";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  module: string;
  action: string;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        module: "dashboard",
        action: "view",
      },
    ],
  },
  {
    label: "Catálogo",
    items: [
      {
        label: "Productos",
        path: ROUTES.PRODUCTS,
        icon: Package,
        module: "products",
        action: "view",
      },
    ],
  },
  {
    label: "Usuarios",
    items: [
      {
        label: "Usuarios",
        path: ROUTES.USERS,
        icon: Users,
        module: "users",
        action: "view",
      },
      {
        label: "Clientes",
        path: ROUTES.CLIENTS,
        icon: UserCheck,
        module: "clients",
        action: "view",
      },
    ],
  },
  {
    label: "Operaciones",
    items: [
      {
        label: "Órdenes",
        path: ROUTES.ORDERS,
        icon: ShoppingBag,
        module: "orders",
        action: "view",
      },
      {
        label: "Roles",
        path: ROUTES.ROLES,
        icon: Shield,
        module: "roles",
        action: "view",
      },
    ],
  },
];

function canSee(
  permissions: ModulePermission[],
  module: string,
  action: string,
): boolean {
  return permissions.some(
    (p) => p.module === module && p.actions.includes(action),
  );
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onClose: () => void;
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onClose,
}: Readonly<SidebarProps>) {
  const permissions = useAppSelector(selectPermissions);

  const showAll = permissions.length === 0;
  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => showAll || canSee(permissions, item.module, item.action),
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col",
        "bg-white border-r border-outline-variant",
        "transition-[width,transform] duration-300 ease-in-out will-change-transform",
        collapsed ? "w-16" : "w-60",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 shrink-0 overflow-hidden",
          collapsed ? "justify-center px-0" : "px-6 gap-3",
        )}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-[0_4px_12px_-2px_rgba(0,107,88,0.35)]"
          style={{ background: "linear-gradient(135deg, #005142 0%, #006b58 55%, #54dcbc 100%)" }}
        >
          <ShoppingBag size={15} color="#ffffff" strokeWidth={2.25} />
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold tracking-tight leading-none text-on-surface">
                SportsCart
              </p>
              <p className="text-[10px] font-medium text-on-surface-variant leading-tight mt-1">
                Admin Panel
              </p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-on-surface-variant hover:bg-[#effaf6] transition-colors shrink-0"
              aria-label="Cerrar menú"
            >
              <X size={15} />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-3 pb-6 px-3 space-y-6">
        {visibleGroups.map((group, i) => (
          <div key={i}>
            {group.label && !collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-outline select-none">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-outline-variant p-3 space-y-1">
        <button
          onClick={onCollapse}
          className={cn(
            "hidden lg:flex items-center w-full h-9 rounded-md transition-colors",
            "text-on-surface-variant hover:bg-[#effaf6] hover:text-[#005142]",
            collapsed ? "justify-center" : "px-3 gap-3",
          )}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-[13px]">Cerrar menu</span>}
        </button>
        {!collapsed && (
          <p className="px-3 pt-1 text-[10px] tabular-nums text-outline select-none">
            v1.0.0 · Sprint 1
          </p>
        )}
      </div>
    </aside>
  );
}

function SidebarNavItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  return (
    <div className="relative group/nav">
      <NavLink
        to={item.path}
        end={item.path === ROUTES.DASHBOARD}
        className={({ isActive }) =>
          cn(
            "relative flex items-center h-10 rounded-md text-[13px] transition-colors",
            collapsed ? "justify-center w-full" : "gap-3 px-3",
            isActive
              ? "bg-[#ddfbf2] text-[#006b58] font-semibold before:absolute before:-left-3 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-full before:bg-gradient-to-b before:from-primary before:to-mint-dim"
              : "text-on-surface-variant hover:bg-[#effaf6] hover:text-[#005142]",
          )
        }
      >
        <item.icon size={17} strokeWidth={1.75} className="shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>

      {collapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-on-surface px-2.5 py-1.5 text-xs font-medium text-white shadow-dropdown opacity-0 transition-opacity group-hover/nav:opacity-100">
          {item.label}
        </div>
      )}
    </div>
  );
}
