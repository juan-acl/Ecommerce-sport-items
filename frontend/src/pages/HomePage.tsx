import { Link } from 'react-router-dom';
import { Button } from '@shared/components/ui/Button';
import { ROUTES } from '@shared/constants/routes';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-headline-lg lg:text-5xl text-on-surface mb-6 leading-tight">
          Equipamiento deportivo de élite{' '}
          <span className="text-primary">para atletas exigentes</span>
        </h1>

        <p className="text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          Descubre nuestra selección curada de productos premium diseñados para llevarte al
          siguiente nivel.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={ROUTES.PRODUCTS}>
            <Button size="lg">
              Explorar productos
              <span className="material-symbols-outlined">arrow_forward</span>
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <p className="text-headline-md text-primary mb-1">99.8%</p>
            <p className="text-label-md text-on-surface-variant">Entregas a tiempo</p>
          </div>
          <div>
            <p className="text-headline-md text-primary mb-1">24/7</p>
            <p className="text-label-md text-on-surface-variant">Soporte experto</p>
          </div>
          <div>
            <p className="text-headline-md text-primary mb-1">+500</p>
            <p className="text-label-md text-on-surface-variant">Productos premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
