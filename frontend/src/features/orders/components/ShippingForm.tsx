import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { shippingAddressSchema, type ShippingAddressFormData } from '../api/schemas';

interface ShippingFormProps {
  defaultValues?: Partial<ShippingAddressFormData>;
  onSubmit: (data: ShippingAddressFormData) => void;
  onBack: () => void;
}

export function ShippingForm({ defaultValues, onSubmit, onBack }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      street: defaultValues?.street ?? '',
      city: defaultValues?.city ?? 'Guatemala',
      country: defaultValues?.country ?? 'Guatemala',
      postalCode: defaultValues?.postalCode ?? '',
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-headline-sm text-on-surface">Dirección de envío</h2>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="street"
          type="text"
          label="Dirección completa"
          placeholder="5a Avenida 10-50 Zona 10"
          icon="home"
          error={errors.street?.message}
          {...register('street')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            id="city"
            type="text"
            label="Ciudad"
            placeholder="Guatemala"
            icon="location_city"
            error={errors.city?.message}
            {...register('city')}
          />

          <Input
            id="country"
            type="text"
            label="País"
            placeholder="Guatemala"
            icon="public"
            error={errors.country?.message}
            {...register('country')}
          />
        </div>

        <Input
          id="postalCode"
          type="text"
          label="Código postal"
          placeholder="01010"
          icon="markunread_mailbox"
          error={errors.postalCode?.message}
          {...register('postalCode')}
        />

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back</span>
            Volver al carrito
          </Button>
          <Button type="submit" size="lg">
            Continuar al pago
            <span className="material-symbols-outlined">arrow_forward</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
