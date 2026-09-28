import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { ROUTES } from '@shared/constants/routes';
import { useRegisterMutation } from '../api/authApi';
import { registerSchema, type RegisterFormData } from '../api/schemas';
import { useAuth } from '../hooks/useAuth';

export function RegisterForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptedTerms) {
      toast.error('Debes aceptar los términos para continuar');
      return;
    }

    try {
      const result = await registerUser(data).unwrap();
      setAuth(result);
      toast.success(`¡Bienvenido, ${result.user.name}! Tu cuenta fue creada.`);
      navigate(ROUTES.PRODUCTS);
    } catch (err) {
      const error = err as { data?: { message?: string; code?: string } };
      if (error.data?.code === 'CONFLICT') {
        toast.error('Ya existe una cuenta con este correo electrónico');
      } else {
        toast.error(error.data?.message || 'Error al crear la cuenta');
      }
    }
  };

  return (
    <div className="space-y-unit-xl">
      <div>
        <div className="flex items-center gap-unit-sm mb-unit-lg lg:hidden">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined !text-white text-lg">sports</span>
          </div>
          <span className="text-headline-sm text-primary">SportCart</span>
        </div>
        <h3 className="text-headline-md text-on-surface mb-unit-xs">Crear cuenta</h3>
        <p className="text-body-md text-on-surface-variant">
          Comienza tu camino al equipamiento deportivo premium.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-unit-lg">
        <Input
          id="name"
          type="text"
          label="Nombre completo"
          placeholder="Ana Pérez"
          icon="person"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="nombre@ejemplo.com"
          icon="mail"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="••••••••"
          icon="lock"
          hint="Mínimo 8 caracteres."
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

        <div className="flex items-center gap-3">
          <input
            id="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="terms" className="text-label-md text-on-surface-variant cursor-pointer">
            Acepto los{' '}
            <a href="#" className="text-primary font-bold hover:underline">
              Términos de Servicio
            </a>{' '}
            y la{' '}
            <a href="#" className="text-primary font-bold hover:underline">
              Política de Privacidad
            </a>
            .
          </label>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          Crear cuenta
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </form>

      <div className="pt-unit-lg border-t border-outline-variant text-center">
        <span className="text-body-md text-on-surface-variant">¿Ya tienes cuenta? </span>
        <Link
          to={ROUTES.LOGIN}
          className="text-label-md text-primary hover:underline font-semibold"
        >
          Inicia sesión
        </Link>
      </div>
    </div>
  );
}
