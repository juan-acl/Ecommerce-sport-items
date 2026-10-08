import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@shared/utils/cn';

const COLLAPSED_KEY = 'sidebar_collapsed';

export function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-surface-bright">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={toggleCollapsed}
        onClose={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'flex flex-col min-h-screen',
          'transition-[padding-left] duration-300 ease-in-out',
          collapsed ? 'lg:pl-16' : 'lg:pl-60',
        )}
      >
        <TopBar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
