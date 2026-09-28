import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useCartSync } from '@features/cart/hooks/useCartSync';

export function MainLayout() {
  useCartSync();

  return (
    <div className="min-h-screen flex flex-col bg-surface-bright">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
