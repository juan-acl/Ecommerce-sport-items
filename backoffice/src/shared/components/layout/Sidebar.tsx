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
          "flex items-center h-14 border-b border-outline-variant shrink-0 overflow-hidden",
          collapsed ? "justify-center px-0" : "px-4 gap-3",
        )}
      >
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <ShoppingBag size={14} className="text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-body-md font-bold text-on-surface leading-tight">
                SportsCart
              </p>
              <p className="text-[10px] text-on-surface-variant leading-tight tracking-wide">
                Admin Panel
              </p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
              aria-label="Cerrar menú"
            >
              <X size={15} />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4">
        {visibleGroups.map((group, i) => (
          <div key={i}>
            {group.label && !collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 select-none">
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

      <div className="shrink-0 border-t border-outline-variant p-2 space-y-1">
        <button
          onClick={onCollapse}
          className={cn(
            "hidden lg:flex items-center w-full h-9 rounded-lg transition-colors",
            "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
            collapsed ? "justify-center" : "px-3 gap-3",
          )}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-body-md">Colapsar</span>}
        </button>
        {!collapsed && (
          <p className="px-3 text-[10px] text-on-surface-variant/35 select-none">
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
            "flex items-center h-9 rounded-lg text-body-md transition-colors",
            collapsed ? "justify-center w-full" : "gap-3 px-3",
            isActive
              ? "bg-primary/10 text-primary font-semibold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
          )
        }
      >
        <item.icon size={17} className="shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>

      {collapsed && (
        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-md bg-on-surface px-2.5 py-1.5 text-xs font-medium text-white shadow-card opacity-0 transition-opacity group-hover/nav:opacity-100">
          {item.label}
        </div>
      )}
    </div>
  );
}
