import { Link } from 'react-router-dom';
import { Button } from '@shared/components/ui/Button';
import { ROUTES } from '@shared/constants/routes';

export function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
      <h1 className="text-headline-lg text-primary mb-4">404</h1>
      <h2 className="text-headline-md text-on-surface mb-4">Página no encontrada</h2>
      <p className="text-body-md text-on-surface-variant mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <Link to={ROUTES.HOME}>
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  );
}
