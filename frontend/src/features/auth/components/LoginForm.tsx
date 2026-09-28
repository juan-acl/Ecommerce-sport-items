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
    <div className="space-y-unit-xl">
      <div>
        <div className="flex items-center gap-unit-sm mb-unit-lg">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-cta">
            <span className="material-symbols-outlined !text-white text-3xl">sports</span>
          </div>
          <h2 className="text-headline-sm text-primary tracking-tight">SportCart</h2>
        </div>
        <h3 className="text-headline-md text-on-surface mb-unit-xs">Bienvenido de nuevo</h3>
        <p className="text-body-md text-on-surface-variant">
          Inicia sesión con tus credenciales para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-unit-lg">
        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="nombre@ejemplo.com"
          icon="mail"
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
              className="text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon="lock"
            error={errors.password?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-outline hover:text-primary transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            }
            {...register('password')}
          />
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          Iniciar sesión
        </Button>
      </form>

      <div className="pt-unit-lg border-t border-outline-variant flex justify-center items-center gap-unit-xs">
        <span className="text-body-md text-on-surface-variant">¿No tienes cuenta?</span>
        <Link
          to={ROUTES.REGISTER}
          className="text-label-md text-primary hover:underline font-semibold"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
