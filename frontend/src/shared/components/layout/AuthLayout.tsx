import { ReactNode } from 'react';
import { ShoppingBag } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-[6fr_5fr] relative">
        <div className="bg-white flex flex-col px-10 py-10 min-h-[540px]">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <ShoppingBag size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-on-surface text-body-lg tracking-tight">
              SportsCart
            </span>
          </div>
          {children}
        </div>

        <div className="hidden lg:block bg-surface-container-low p-3">
          <div className="relative h-full rounded-2xl overflow-hidden min-h-[540px]">
            <img
              src="/banner.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
