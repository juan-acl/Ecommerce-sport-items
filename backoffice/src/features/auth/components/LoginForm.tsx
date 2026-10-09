import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@app/hooks';
import { setCredentials } from '@features/auth/store/authSlice';
import { useLoginMutation } from '@features/auth/api/authApi';
import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
          permissions: result.permissions,
        }),
      );
      toast.success(`Bienvenido, ${result.user.name}`);
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const error = err as { data?: string; status?: number; message?: string };
      if (error?.status === 401 || error?.status === 403) {
        toast.error('Credenciales inválidas.');
      } else if (error?.message?.includes('cliente')) {
        toast.error('Los clientes no pueden acceder al panel de administración.');
      } else {
        toast.error('No tienes permisos para acceder al panel.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        {...register('email')}
        id="email"
        type="email"
        label="Correo electrónico"
        placeholder="usuario@sportscart.com"
        error={errors.email?.message}
        autoComplete="email"
        className={field(!!errors.email)}
      />

      <Input
        {...register('password')}
        id="password"
        type={showPassword ? 'text' : 'password'}
        label="Contraseña"
        placeholder="••••••••"
        error={errors.password?.message}
        autoComplete="current-password"
        className={field(!!errors.password)}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 rounded text-[#71787d] hover:text-[#006b58] transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <div className="pt-5">
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="group h-12 rounded-sm justify-between px-5 bg-[#006b58] shadow-none hover:bg-[#005142] focus:ring-[#006b58]/40"
        >
          <span>Ingresar al panel</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </form>
  );
}

function field(hasError: boolean) {
  return cn(
    'rounded-none border-0 border-b bg-transparent pl-0 py-2.5 text-body-lg text-[#111c2d]',
    'placeholder:text-[#c0c7cd] focus:ring-0',
    hasError ? 'border-error focus:border-error' : 'border-[#c0c7cd] focus:border-[#006b58]',
  );
}
