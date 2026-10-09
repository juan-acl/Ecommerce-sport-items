import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { ROUTES } from '@shared/constants/routes';
import { useLoginMutation } from '../api/authApi';
import { loginSchema, type LoginFormData } from '../api/schemas';
import { useAuth } from '../hooks/useAuth';
import { fieldClass } from './fieldStyles';

export function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
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
      setAuth(result);
      toast.success(`Bienvenido de nuevo, ${result.user.name}`);
      navigate(ROUTES.PRODUCTS);
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || 'Credenciales inválidas');
    }
  };

  return (
    <div>
      <h1 className="text-[40px] leading-[1.05] font-light tracking-tight text-on-surface">
        Hola de <span className="font-extrabold text-primary">nuevo.</span>
      </h1>
      <p className="mt-3 text-body-md text-on-surface-variant">
        Inicia sesión con tus credenciales para continuar.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-7" noValidate>
        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="nombre@ejemplo.com"
          autoComplete="email"
          className={fieldClass(!!errors.email)}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-unit-sm">
          <div className="flex justify-between items-center">
            <label className="block text-label-md text-on-surface-variant" htmlFor="password">
              Contraseña
            </label>
            <button
              type="button"
              className="text-label-md text-outline hover:text-primary transition-colors"
            >
              ¿La olvidaste?
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className={fieldClass(!!errors.password)}
            error={errors.password?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-label-md uppercase tracking-wider text-outline hover:text-primary transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            }
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          className="group !mt-10 h-14 rounded-full justify-between px-7"
        >
          <span>Iniciar sesión</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Button>
      </form>

      <p className="mt-8 text-body-md text-on-surface-variant">
        ¿Primera vez aquí?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Crea una cuenta
        </Link>
      </p>
    </div>
  );
}
