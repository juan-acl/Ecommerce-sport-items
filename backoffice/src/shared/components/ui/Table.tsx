import type { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: Readonly<TableProps>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-outline-variant bg-white">
      <table className={cn('w-full text-body-md', className)}>{children}</table>
    </div>
  );
}

export function TableHead({ children }: Readonly<{ children: ReactNode }>) {
  return <thead className="border-b border-outline-variant">{children}</thead>;
}

export function TableBody({ children }: Readonly<{ children: ReactNode }>) {
  return <tbody>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className }: Readonly<TableRowProps>) {
  return (
    <tr
      className={cn(
        'border-t border-outline-variant first:border-t-0 hover:bg-surface-container-low transition-colors',
        className,
      )}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: Readonly<TableCellProps>) {
  return (
    <td className={cn('px-4 py-3 text-on-surface', className)}>{children}</td>
  );
}

interface TableHeaderCellProps {
  children: ReactNode;
  className?: string;
}

export function TableHeaderCell({ children, className }: Readonly<TableHeaderCellProps>) {
  return (
    <th
      className={cn(
        'px-4 py-2.5 text-left text-[11px] text-on-surface-variant font-medium uppercase tracking-[0.06em]',
        className,
      )}
    >
      {children}
    </th>
  );
}
