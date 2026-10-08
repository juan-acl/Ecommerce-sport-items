import { ShoppingBag } from "lucide-react";
import { LoginForm } from "@features/auth/components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-[5fr_6fr] relative">
        <div className="bg-white flex flex-col px-10 py-10">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <ShoppingBag size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-on-surface text-body-lg tracking-tight">
              SportsCart
            </span>
          </div>
          <div className="mb-8">
            <h1 className="text-headline-lg font-bold text-on-surface leading-tight mb-2">
              Iniciar sesión
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Ingresa tus credenciales para acceder al panel de administración
            </p>
          </div>
          <LoginForm />
          <p className="mt-auto pt-8 text-label-md text-on-surface-variant/50">
            © {new Date().getFullYear()} SportsCart · Acceso restringido
          </p>
        </div>

        <div className="hidden lg:block bg-surface-container-low p-3">
          <div className="relative h-full rounded-2xl overflow-hidden min-h-[520px]">
            <img
              src="/banner.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
