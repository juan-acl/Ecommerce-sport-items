import { AuthLayout } from '@shared/components/layout/AuthLayout';
import { LoginForm } from '@features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
