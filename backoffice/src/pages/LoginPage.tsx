import { LoginForm } from "@features/auth/components/LoginForm";

function LoginBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0, 53, 74, 0.13) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 45%, #000 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 45%, #000 25%, transparent 78%)",
        }}
      />
      <div className="login-float absolute -top-48 -right-40 h-[460px] w-[460px] rounded-full bg-[#c3e8ff]/50 blur-[130px]" />
      <div className="login-float-slow absolute -bottom-56 -left-40 h-[500px] w-[500px] rounded-full bg-[#74f9d7]/15 blur-[130px]" />
      <span
        className="select-none absolute -bottom-[0.26em] left-1/2 -translate-x-1/2 whitespace-nowrap text-[20vw] font-extrabold leading-none tracking-tighter text-transparent"
        style={{ WebkitTextStroke: "1px rgba(0, 53, 74, 0.07)" }}
      >
        ADMIN
      </span>
    </div>
  );
}

export function LoginPage() {
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f9f9ff] text-[#111c2d]">
      <LoginBackground />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-[#00354a]" />
            <span className="text-body-md font-bold tracking-tight">
              SportsCart
            </span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71787d]">
            Backoffice
          </span>
        </header>

        <main className="flex flex-1 items-center justify-center py-12">
          <div className="login-rise w-full max-w-[360px]">
            <div className="flex items-end justify-between border-b-2 border-[#00354a] pb-3">
              <span className="text-body-md font-bold">
                Panel de administración
              </span>
              <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71787d]">
                <span className="tabular-nums text-[#00354a]">01</span>
                <span className="h-px w-6 bg-[#006b58]" />
                Acceso
              </span>
            </div>

            <h1 className="mt-9 text-[32px] font-light leading-[1.1] tracking-tight">
              Acceso al{" "}
              <span className="font-bold text-[#00354a]">sistema.</span>
            </h1>
            <p className="mt-2 text-body-md text-[#41484d]">
              Ingresa tus credenciales corporativas para continuar.
            </p>

            <div className="mt-9">
              <LoginForm />
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-[#c0c7cd] pt-3 text-[11px] text-[#71787d]">
              <span>Uso exclusivo del personal autorizado</span>
              <span className="tabular-nums">v1.0.0</span>
            </div>
          </div>
        </main>

        <footer className="text-center text-[11px] text-[#71787d]">
          © {year} SportsCart · ¿Sin acceso? Contacta al administrador del
          sistema.
        </footer>
      </div>
    </div>
  );
}
