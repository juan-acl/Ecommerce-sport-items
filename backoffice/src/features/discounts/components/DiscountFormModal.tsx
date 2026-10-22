import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { useCreateDiscountMutation } from '@features/discounts/api/discountsApi';
import { discountSchema, type DiscountFormData } from '../schemas';

const CATEGORY_OPTIONS = [
  { value: 'running', label: 'Running' },
  { value: 'football', label: 'Fútbol' },
  { value: 'basketball', label: 'Baloncesto' },
  { value: 'tennis', label: 'Tenis' },
  { value: 'swimming', label: 'Natación' },
  { value: 'cycling', label: 'Ciclismo' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'other', label: 'Otros' },
] as const;

type FormData = DiscountFormData;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscountFormModal({ isOpen, onClose }: Readonly<Props>) {
  const [createDiscount, { isLoading }] = useCreateDiscountMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: '',
      type: 'percentage',
      value: 10,
      minPurchase: 0,
      maxUses: 0,
      expiresAt: '',
      applicableCategories: [],
    },
  });

  const watchedType = watch('type');

  useEffect(() => {
    if (isOpen) {
      reset({
        code: '',
        type: 'percentage',
        value: 10,
        minPurchase: 0,
        maxUses: 0,
        expiresAt: '',
        applicableCategories: [],
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Convertir "YYYY-MM-DD" del input date a ISO completo (fin del día)
      let expiresAt: string | null = null;
      if (data.expiresAt) {
        const d = new Date(`${data.expiresAt}T23:59:59`);
        expiresAt = d.toISOString();
      }
      await createDiscount({
        code: data.code,
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase,
        maxUses: data.maxUses,
        expiresAt,
        applicableCategories: data.applicableCategories?.length ? data.applicableCategories : undefined,
      }).unwrap();
      toast.success('Descuento creado correctamente.');
      onClose();
    } catch {
      toast.error('Error al crear el descuento.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo descuento"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            Crear descuento
          </Button>
        </>
      }
    >
      <form className="space-y-4" noValidate>
        <Input
          {...register('code', {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase();
            },
          })}
          id="code"
          label="Código"
          placeholder="Ej: DEPORTE20"
          maxLength={20}
          hint="Solo letras mayúsculas, números y guiones"
          error={errors.code?.message}
        />

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-on-surface">
            Tipo de descuento
          </label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <select
                {...field}
                className="w-full h-10 pl-3 pr-3 bg-white border border-outline-variant rounded-md text-body-md text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo (GTQ)</option>
              </select>
            )}
          />
        </div>

        <Input
          {...register('value', { valueAsNumber: true })}
          id="value"
          label={watchedType === 'percentage' ? 'Porcentaje (%)' : 'Monto fijo (GTQ)'}
          type="number"
          min={watchedType === 'percentage' ? 1 : 0.01}
          max={watchedType === 'percentage' ? 100 : 9999.99}
          step={watchedType === 'percentage' ? 1 : 0.01}
          placeholder={watchedType === 'percentage' ? '10' : '50.00'}
          error={errors.value?.message}
        />

        <Input
          {...register('minPurchase', { valueAsNumber: true })}
          id="minPurchase"
          label="Compra mínima (GTQ)"
          type="number"
          min={0}
          step={0.01}
          placeholder="0.00"
          hint="0 = sin mínimo"
          error={errors.minPurchase?.message}
        />

        <Input
          {...register('maxUses', { valueAsNumber: true })}
          id="maxUses"
          label="Usos máximos"
          type="number"
          min={0}
          step={1}
          placeholder="0"
          hint="0 = ilimitado"
          error={errors.maxUses?.message}
        />

        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-on-surface">
            Categorías aplicables{' '}
            <span className="text-on-surface-variant font-normal">(opcional — vacío = todas)</span>
          </label>
          <Controller
            control={control}
            name="applicableCategories"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const checked = field.value?.includes(cat.value) ?? false;
                  return (
                    <label
                      key={cat.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-body-sm select-none transition-colors ${checked ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-outline'}`}
                    >
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={checked}
                        onChange={(e) => {
                          const current = field.value ?? [];
                          field.onChange(
                            e.target.checked
                              ? [...current, cat.value]
                              : current.filter((v) => v !== cat.value),
                          );
                        }}
                      />
                      {cat.label}
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>

        <Input
          {...register('expiresAt')}
          id="expiresAt"
          label="Fecha de expiración (opcional)"
          type="date"
          error={errors.expiresAt?.message}
        />
      </form>
    </Modal>
  );
}
