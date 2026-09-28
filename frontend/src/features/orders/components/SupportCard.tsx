import { Button } from '@shared/components/ui/Button';

export function SupportCard() {
  return (
    <div className="bg-primary-fixed/40 border border-primary-fixed-dim rounded-xl p-6">
      <h3 className="text-body-lg font-semibold text-on-surface mb-2">¿Necesitas ayuda?</h3>
      <p className="text-body-md text-on-surface-variant mb-4">
        Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta sobre tu
        orden.
      </p>
      <div className="space-y-2">
        <Button variant="ghost" fullWidth className="!justify-between">
          Contactar soporte
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
        <Button variant="ghost" fullWidth className="!justify-between">
          Política de devolución
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
}
