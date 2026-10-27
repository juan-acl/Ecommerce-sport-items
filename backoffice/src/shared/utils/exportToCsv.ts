export function buildCsvContent(headers: string[], rows: string[][]): string {
  const escape = (cell: string) => `"${String(cell).replace(/"/g, '""')}"`;
  return [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n');
}

export function exportToCsv(filename: string, headers: string[], rows: string[][]): void {
  const content = buildCsvContent(headers, rows);
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
