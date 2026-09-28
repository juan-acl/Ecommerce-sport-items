export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-unit-sm mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined !text-white text-lg">sports</span>
              </div>
              <span className="text-headline-sm text-primary">SportCart</span>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Equipamiento deportivo premium para atletas exigentes.
            </p>
          </div>

          <div>
            <h4 className="text-label-md text-on-surface uppercase tracking-widest mb-4">Tienda</h4>
            <ul className="space-y-2 text-body-md text-on-surface-variant">
              <li>Productos</li>
              <li>Categorías</li>
              <li>Nuevos</li>
              <li>Ofertas</li>
            </ul>
          </div>

          <div>
            <h4 className="text-label-md text-on-surface uppercase tracking-widest mb-4">
              Soporte
            </h4>
            <ul className="space-y-2 text-body-md text-on-surface-variant">
              <li>Política de devolución</li>
              <li>Información de envío</li>
              <li>Contacto</li>
            </ul>
          </div>

          <div>
            <h4 className="text-label-md text-on-surface uppercase tracking-widest mb-4">
              Empresa
            </h4>
            <ul className="space-y-2 text-body-md text-on-surface-variant">
              <li>Términos de servicio</li>
              <li>Política de privacidad</li>
              <li>Sustentabilidad</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-label-md text-on-surface-variant">
            © {currentYear} SportCart Corp. Premium Craftsmanship.
          </p>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
              language
            </span>
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
              mail
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
