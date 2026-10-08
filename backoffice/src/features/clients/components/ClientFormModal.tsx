import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { User } from '@shared/types/common';
import { useCreateClientMutation, useUpdateClientMutation } from '@features/clients/api/clientsApi';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';

const createSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const editSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: User | null;
}

export function ClientFormModal({ isOpen, onClose, client }: Readonly<ClientFormModalProps>) {
  const isEditing = !!client;
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormData | EditFormData>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
  });

  useEffect(() => {
    if (client) {
      reset({ name: client.name, email: client.email });
    } else {
      reset({ name: '', email: '', password: '' });
    }
  }, [client, reset]);

  const onSubmit = async (data: CreateFormData | EditFormData) => {
    try {
      if (isEditing && client) {
        await updateClient({ id: client.id, ...data }).unwrap();
        toast.success('Cliente actualizado.');
      } else {
        await createClient(data as CreateFormData).unwrap();
        toast.success('Cliente creado.');
      }
      onClose();
    } catch {
      toast.error('Error al guardar el cliente.');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar cliente' : 'Nuevo cliente'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" noValidate>
        <Input
          {...register('name')}
          id="name"
          label="Nombre"
          placeholder="Nombre completo"
          error={errors.name?.message}
        />
        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Email"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
        />
        {!isEditing && (
          <Input
            {...register('password' as keyof (CreateFormData | EditFormData))}
            id="password"
            type="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            error={(errors as { password?: { message?: string } }).password?.message}
          />
        )}
      </form>
    </Modal>
  );
}
