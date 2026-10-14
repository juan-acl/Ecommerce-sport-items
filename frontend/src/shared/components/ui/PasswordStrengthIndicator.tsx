import { Check, Minus } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const REQUIREMENTS = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Una letra mayúscula (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Una letra minúscula (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Un número (0–9)', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Un carácter especial (!@#$%...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1.5 px-1">
      {REQUIREMENTS.map(({ label, test }) => {
        const met = test(password);
        return (
          <li
            key={label}
            className={`flex items-center gap-1.5 text-[11px] transition-colors duration-150 ${
              met ? 'text-emerald-600' : 'text-on-surface-variant'
            }`}
          >
            {met ? (
              <Check size={11} strokeWidth={3} className="flex-shrink-0" />
            ) : (
              <Minus size={11} strokeWidth={2} className="flex-shrink-0 opacity-40" />
            )}
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
