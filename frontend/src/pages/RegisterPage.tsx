import { AuthLayout } from '@shared/components/layout/AuthLayout';
import { RegisterForm } from '@features/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
