import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/ui/Button';
import { ROUTES } from '@shared/constants/routes';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl font-bold text-on-surface-variant">404</span>
      </div>
      <h1 className="text-headline-lg text-on-surface mb-3">Página no encontrada</h1>
      <p className="text-body-lg text-on-surface-variant mb-8 max-w-sm">
        La sección que buscas no existe o fue movida a otra ubicación.
      </p>
      <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Volver al Dashboard</Button>
    </div>
  );
}
