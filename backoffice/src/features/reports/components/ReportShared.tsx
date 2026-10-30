import { AlertTriangle } from 'lucide-react';
import { Spinner } from '@shared/components/ui/Spinner';
import type { ReportPeriod } from '@features/reports/api/reportsApi';

export const PERIOD_OPTIONS: { label: string; value: ReportPeriod }[] = [
  { label: 'Hoy', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
];

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
}

export function StatCard({ label, value, sub, icon, accent = '#006b58' }: Readonly<StatCardProps>) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-soft flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em]">{label}</p>
        <p className="text-[22px] font-bold text-on-surface tracking-tight mt-0.5 leading-none">{value}</p>
        {sub && <p className="text-body-sm text-on-surface-variant mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function SectionError({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex items-center gap-2 py-8 justify-center text-error">
      <AlertTriangle size={16} />
      <p className="text-body-md">{message}</p>
    </div>
  );
}

export function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}

export function EmptyRow({ colSpan, message }: Readonly<{ colSpan: number; message: string }>) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-8 text-center text-on-surface-variant">
        {message}
      </td>
    </tr>
  );
}

export function PeriodFilter({
  period,
  onChange,
}: Readonly<{ period: ReportPeriod; onChange: (p: ReportPeriod) => void }>) {
  return (
    <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 w-fit">
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`h-7 px-3 rounded-md text-[13px] font-medium transition-colors ${
            period === opt.value
              ? 'bg-white text-on-surface shadow-soft'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
