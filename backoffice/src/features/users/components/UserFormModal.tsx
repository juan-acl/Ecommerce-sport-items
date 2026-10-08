import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { User } from '@shared/types/common';
import { useCreateUserMutation, useUpdateUserMutation } from '@features/users/api/usersApi';
import { useGetRolesQuery } from '@features/roles/api/rolesApi';
import { Modal } from '@shared/components/ui/Modal';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';

const baseFields = {
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'El rol es requerido'),
};

const createSchema = z.object({
  ...baseFields,
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const editSchema = z.object({
  ...baseFields,
  password: z.string().min(6).optional().or(z.literal('')),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;
type FormData = CreateFormData | EditFormData;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserFormModal({ isOpen, onClose, user }: Readonly<UserFormModalProps>) {
  const isEditing = !!user;
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: roles = [], isLoading: rolesLoading, refetch: refetchRoles } = useGetRolesQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
  });

  useEffect(() => {
    if (!isOpen) return;
    refetchRoles();
    if (user) {
      reset({ name: user.name, email: user.email, role: user.role, password: '' });
    } else {
      reset({ name: '', email: '', password: '', role: roles[0]?.name ?? 'client' });
    }
  }, [isOpen, user, reset, roles, refetchRoles]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && user) {
        const { password, ...rest } = data as EditFormData;
        await updateUser({
          id: user.id,
          ...rest,
          ...(password ? { password } : {}),
        }).unwrap();
        toast.success('Usuario actualizado.');
      } else {
        await createUser(data as CreateFormData).unwrap();
        toast.success('Usuario creado.');
      }
      onClose();
    } catch {
      toast.error('Error al guardar el usuario.');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar usuario' : 'Nuevo usuario'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            {isEditing ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" noValidate>
        <Input
          {...register('name')}
          id="name"
          label="Nombre completo"
          placeholder="Ej: Carlos Mendoza López"
          error={errors.name?.message}
        />
        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
        />
        {!isEditing && (
          <Input
            {...register('password')}
            id="password"
            type="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            error={(errors as { password?: { message?: string } }).password?.message}
          />
        )}
        {isEditing && (
          <Input
            {...register('password')}
            id="password"
            type="password"
            label="Nueva contraseña"
            placeholder="Dejar vacío para no cambiar"
            error={(errors as { password?: { message?: string } }).password?.message}
          />
        )}
        <div className="space-y-1.5">
          <label htmlFor="role" className="block text-label-md text-on-surface-variant">
            Rol
          </label>
          <div className="relative">
            <select
              {...register('role')}
              id="role"
              disabled={rolesLoading}
              className="w-full py-3.5 pl-4 pr-4 bg-white border border-outline-variant rounded-xl outline-none transition-all focus:ring-2 focus:ring-primary focus:border-primary text-body-md text-on-surface disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
              {rolesLoading ? (
                <option value="">Cargando roles...</option>
              ) : roles.length === 0 ? (
                <>
                  <option value="client">Cliente</option>
                  <option value="admin">Administrador</option>
                </>
              ) : (
                roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                  </option>
                ))
              )}
            </select>
            {rolesLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 size={16} className="animate-spin text-on-surface-variant" />
              </div>
            )}
          </div>
          {errors.role && (
            <p className="text-label-md text-error px-1">{errors.role.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
