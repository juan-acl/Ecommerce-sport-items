import { NavLink } from 'react-router-dom';
import { useAppSelector } from '@app/hooks';
import { selectCurrentUser } from '@features/auth/store/authSlice';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';

interface NavItem {
  label: string;
  icon: string;
  to?: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  // { label: 'Mi información', icon: 'account_circle', disabled: true },
  { label: 'Mis órdenes', icon: 'inventory_2', to: ROUTES.ORDERS },
  // { label: 'Lista de deseos', icon: 'favorite', disabled: true },
  // { label: 'Métodos de pago', icon: 'credit_card', disabled: true },
  // { label: 'Direcciones', icon: 'location_on', disabled: true },
];

export function ProfileSidebar() {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <aside className="bg-white rounded-xl shadow-card overflow-hidden lg:sticky lg:top-24 self-start">
      {/* User info */}
      <div className="p-6 border-b border-outline-variant">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-headline-sm font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-lg font-semibold text-on-surface line-clamp-1">{user.name}</p>
            <p className="text-label-md text-on-surface-variant line-clamp-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.disabled ? (
                <span
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md text-outline cursor-not-allowed"
                  title="Próximamente"
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </span>
              ) : (
                <NavLink
                  to={item.to!}
                  end
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md transition-colors',
                      isActive
                        ? 'bg-primary text-white font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container-low',
                    )
                  }
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
