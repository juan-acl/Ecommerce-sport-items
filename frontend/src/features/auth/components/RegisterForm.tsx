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
import { fieldClass } from './fieldStyles';

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
    <div>
      <h1 className="text-[40px] leading-[1.05] font-light tracking-tight text-on-surface">
        Tu primer <span className="font-extrabold text-primary">paso.</span>
      </h1>
      <p className="mt-3 text-body-md text-on-surface-variant">
        Comienza tu camino al equipamiento deportivo premium.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-7" noValidate>
        <Input
          id="name"
          type="text"
          label="Nombre completo"
          placeholder="Ana Pérez"
          autoComplete="name"
          className={fieldClass(!!errors.name)}
          error={errors.name?.message}
          {...register('name')}
        />

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

        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="••••••••"
          autoComplete="new-password"
          hint="Mínimo 8 caracteres."
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

        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
          />
          <label
            htmlFor="terms"
            className="text-label-md font-normal text-on-surface-variant cursor-pointer"
          >
            Acepto los{' '}
            <a href="#" className="text-on-surface underline underline-offset-2 hover:text-primary">
              Términos de Servicio
            </a>{' '}
            y la{' '}
            <a href="#" className="text-on-surface underline underline-offset-2 hover:text-primary">
              Política de Privacidad
            </a>
            .
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
          className="group !mt-10 h-14 rounded-full justify-between px-7"
        >
          <span>Crear cuenta</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Button>
      </form>

      <p className="mt-8 text-body-md text-on-surface-variant">
        ¿Ya tienes cuenta?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
