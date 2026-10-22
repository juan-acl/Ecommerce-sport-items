import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Supplier } from '@shared/types/common';
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from '@features/suppliers/api/suppliersApi';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { emailValidator, nameValidator, nitValidator } from '@shared/utils/validationSchemas';

const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre no puede exceder 150 caracteres')
    .regex(
      /^[\p{L}\p{N}\s.,\-'&/()+]+$/u,
      "Solo puede contener letras, números, espacios y signos básicos (.,'-&)",
    )
    .refine(
      (val) => /\p{L}/u.test(val),
      'El nombre del proveedor debe contener al menos una letra',
    ),
  nit: nitValidator,
  contactName: nameValidator,
  email: emailValidator,
  phone: z
    .string()
    .trim()
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(
      /^\+?[\d\s\-(). ]{7,20}$/,
      'El teléfono solo puede contener números, espacios y los símbolos + - ( )',
    ),
  address: z
    .string()
    .trim()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(300, 'La dirección no puede exceder 300 caracteres')
    .regex(
      /^[\p{L}\p{N}\s.,\-#/()°]+$/u,
      'Solo puede contener letras, números, espacios y signos de dirección (# / . ,)',
    ),
});

type FormData = z.infer<typeof supplierSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
}

export function SupplierFormModal({ isOpen, onClose, supplier }: Readonly<Props>) {
  const isEditing = !!supplier;
  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(supplierSchema) });

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        nit: supplier.nit ?? '',
        contactName: supplier.contactName,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      });
    } else {
      reset({ name: '', nit: '', contactName: '', email: '', phone: '', address: '' });
    }
  }, [supplier, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && supplier) {
        await updateSupplier({ id: supplier.id, ...data }).unwrap();
        toast.success('Proveedor actualizado.');
      } else {
        await createSupplier(data).unwrap();
        toast.success('Proveedor creado.');
      }
      onClose();
    } catch {
      toast.error('Error al guardar el proveedor.');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear proveedor'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" noValidate>
        <Input
          {...register('name')}
          id="name"
          label="Nombre del proveedor"
          placeholder="Ej. Adidas Guatemala S.A."
          maxLength={150}
          error={errors.name?.message}
        />
        <Input
          {...register('nit')}
          id="nit"
          label="NIT del proveedor (emisor)"
          placeholder="Ej. 12345678-9 o CF"
          maxLength={12}
          hint="Número de Identificación Tributaria del proveedor"
          error={errors.nit?.message}
        />
        <Input
          {...register('contactName')}
          id="contactName"
          label="Nombre de contacto"
          placeholder="Ej. Juan Pérez"
          maxLength={100}
          error={errors.contactName?.message}
        />
        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="contacto@proveedor.com"
          maxLength={254}
          error={errors.email?.message}
        />
        <Input
          {...register('phone')}
          id="phone"
          type="tel"
          label="Teléfono"
          placeholder="Ej. +502 2222-3333"
          maxLength={20}
          inputMode="tel"
          hint="Solo números, espacios y los símbolos + - ( )"
          error={errors.phone?.message}
        />
        <Input
          {...register('address')}
          id="address"
          label="Dirección"
          placeholder="Ej. 5a Av. 15-45, Zona 10, Guatemala"
          maxLength={300}
          error={errors.address?.message}
        />
      </form>
    </Modal>
  );
}
