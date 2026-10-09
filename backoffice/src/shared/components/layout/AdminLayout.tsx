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
    <div className="relative min-h-screen bg-surface">
      {/* Halos cian y menta, como el login del frontend */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-40 h-[520px] w-[520px] rounded-full bg-sky/50 blur-[130px]" />
        <div className="absolute -bottom-56 left-1/4 h-[480px] w-[480px] rounded-full bg-mint/15 blur-[130px]" />
      </div>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={toggleCollapsed}
        onClose={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#111c2d]/30 backdrop-blur-[2px] z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'relative flex flex-col min-h-screen',
          'transition-[padding-left] duration-300 ease-in-out',
          collapsed ? 'lg:pl-16' : 'lg:pl-60',
        )}
      >
        <TopBar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
