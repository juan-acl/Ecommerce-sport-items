import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import type { Supplier, Product } from '@shared/types/common';
import { useCreatePurchaseMutation } from '@features/purchases/api/purchasesApi';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';

const itemSchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  productName: z.string().min(1),
  quantity: z
    .number( 'Ingresa una cantidad válida' )
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser al menos 1')
    .max(9999, 'La cantidad no puede exceder 9,999'),
  unitCost: z
    .number('Ingresa un costo válido')
    .positive('El costo debe ser mayor a 0')
    .max(999999.99, 'El costo no puede exceder Q999,999.99'),
});

const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Selecciona un proveedor'),
  items: z.array(itemSchema).min(1, 'Agrega al menos un producto'),
  notes: z
    .string()
    .trim()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .regex(/^[^<>{}@]*$/, 'Las notas contienen caracteres no permitidos (@, <, >, etc.)')
    .optional(),
});

type FormData = z.infer<typeof purchaseSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  products: Product[];
}

export function PurchaseFormModal({ isOpen, onClose, suppliers, products }: Readonly<Props>) {
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: { supplierId: '', items: [{ productId: '', productName: '', quantity: 1, unitCost: 0 }], notes: '' },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (isOpen) {
      reset({ supplierId: '', items: [{ productId: '', productName: '', quantity: 1, unitCost: 0 }], notes: '' });
    }
  }, [isOpen, reset]);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.productName`, product.name);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createPurchase(data).unwrap();
      toast.success('Compra registrada correctamente.');
      onClose();
    } catch {
      toast.error('Error al registrar la compra.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva compra"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            Registrar compra
          </Button>
        </>
      }
    >
      <form className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label className="block text-[12px] font-medium text-on-surface">Proveedor</label>
          <select
            {...register('supplierId')}
            className="w-full h-10 pl-3 pr-3 bg-white border border-outline-variant rounded-md text-body-md text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
          >
            <option value="">Selecciona un proveedor</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.supplierId && (
            <p className="text-[11px] font-medium text-error">{errors.supplierId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[12px] font-medium text-on-surface">Productos</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append({ productId: '', productName: '', quantity: 1, unitCost: 0 })}
            >
              <Plus size={13} />
              Agregar
            </Button>
          </div>

          {errors.items?.root && (
            <p className="text-[11px] font-medium text-error">{errors.items.root.message}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-outline-variant rounded-lg p-3 space-y-3 bg-surface-container-low/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                    Producto {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-error hover:text-error/80 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Controller
                    control={control}
                    name={`items.${index}.productId`}
                    render={({ field: f }) => (
                      <select
                        value={f.value}
                        onChange={(e) => {
                          f.onChange(e.target.value);
                          handleProductChange(index, e.target.value);
                        }}
                        className="w-full h-10 pl-3 pr-3 bg-white border border-outline-variant rounded-md text-body-md text-on-surface focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary"
                      >
                        <option value="">Selecciona un producto</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.items?.[index]?.productId && (
                    <p className="text-[11px] font-medium text-error">
                      {errors.items[index].productId?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    id={`quantity-${index}`}
                    label="Cantidad"
                    type="number"
                    min={1}
                    max={9999}
                    placeholder="1"
                    error={errors.items?.[index]?.quantity?.message}
                  />
                  <Input
                    {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
                    id={`unitCost-${index}`}
                    label="Costo unitario (Q)"
                    type="number"
                    min={0.01}
                    max={999999.99}
                    step={0.01}
                    placeholder="0.00"
                    error={errors.items?.[index]?.unitCost?.message}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="notes" className="block text-[12px] font-medium text-on-surface">
            Notas (opcional)
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={2}
            maxLength={500}
            placeholder="Observaciones de la compra..."
            className="w-full px-3 py-2 bg-white border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline/80 focus:outline-none focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary resize-none"
          />
        </div>
      </form>
    </Modal>
  );
}
