import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <main className="min-h-screen flex items-stretch">
      <section className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary items-center justify-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary via-primary/80 to-primary-container" />
        <div className="relative z-10 p-unit-xl max-w-xl">
          <div className="mb-unit-lg inline-flex items-center gap-unit-sm bg-white/10 backdrop-blur-md px-unit-md py-unit-xs rounded-full border border-white/20">
            <span className="material-symbols-outlined text-secondary-fixed text-sm">verified</span>
            <span className="text-label-md text-white tracking-widest">CALIDAD CERTIFICADA</span>
          </div>

          <h1 className="text-headline-lg text-white mb-unit-md leading-tight">
            Equipa tu mejor versión.
          </h1>
          <p className="text-body-lg text-primary-fixed-dim leading-relaxed">
            Descubre una selección curada de equipamiento deportivo premium para atletas que buscan
            rendimiento sin compromisos.
          </p>

          <div className="mt-unit-xl grid grid-cols-2 gap-gutter"></div>
        </div>

        <div className="absolute bottom-12 right-12 p-unit-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center gap-unit-sm shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">sports</span>
          </div>
          <span className="text-label-md text-white pr-unit-md uppercase tracking-tight">
            Premium Sports
          </span>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center bg-surface-bright px-margin py-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
