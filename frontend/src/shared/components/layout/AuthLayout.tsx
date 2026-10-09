import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 53, 74, 0.16) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)',
        }}
      />
      <div className="auth-float absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-secondary-fixed/40 blur-[120px]" />
      <div className="auth-float-slow absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-primary-fixed/60 blur-[130px]" />
    </div>
  );
}

export function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  const { pathname } = useLocation();
  const isLogin = pathname === ROUTES.LOGIN;

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-on-surface">
      <AuthBackground />

      <span
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-[0.28em] left-1/2 -translate-x-1/2 text-[22vw] leading-none font-extrabold tracking-tighter text-transparent whitespace-nowrap"
        style={{ WebkitTextStroke: '1px rgba(0, 53, 74, 0.10)' }}
      >
        {isLogin ? 'MOVE' : 'START'}
      </span>

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <Link to={ROUTES.PRODUCTS} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="text-body-md font-bold tracking-tight">SportsCart</span>
          </Link>
          <Link
            to={ROUTES.PRODUCTS}
            className="text-label-md text-on-surface-variant hover:text-primary transition-colors"
          >
            Ir a la tienda →
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-12">
          <div key={pathname} className="w-full max-w-sm auth-rise">
            <nav className="mb-12 flex items-center gap-6 text-label-md uppercase tracking-[0.2em]">
              {[
                { to: ROUTES.LOGIN, n: '01', label: 'Entrar', active: isLogin },
                { to: ROUTES.REGISTER, n: '02', label: 'Registro', active: !isLogin },
              ].map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  aria-current={t.active ? 'page' : undefined}
                  className={cn(
                    'group flex items-center gap-2 transition-colors',
                    t.active ? 'text-primary' : 'text-outline hover:text-on-surface',
                  )}
                >
                  <span className="tabular-nums">{t.n}</span>
                  <span
                    className={cn(
                      'h-px transition-all duration-300',
                      t.active ? 'w-8 bg-secondary' : 'w-3 bg-outline-variant group-hover:w-5',
                    )}
                  />
                  <span>{t.label}</span>
                </Link>
              ))}
            </nav>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
