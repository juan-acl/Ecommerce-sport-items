function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function buildPdfHtml(title: string, headers: string[], rows: string[][]): string {
  const headerCells = headers.map((h) => `<th>${esc(h)}</th>`).join('');
  const bodyRows = rows
    .map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<style>
  body { font-family: sans-serif; padding: 2rem; }
  h1 { font-size: 1.25rem; margin-bottom: 1rem; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; padding: 0.5rem 1rem; text-align: left; }
  th { background: #f5f5f5; font-weight: 600; }
</style>
</head>
<body>
<h1>${esc(title)}</h1>
<table>
<thead><tr>${headerCells}</tr></thead>
<tbody>${bodyRows}</tbody>
</table>
</body>
</html>`;
}

export function exportToPdf(title: string, headers: string[], rows: string[][]): void {
  const html = buildPdfHtml(title, headers, rows);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  win.close();
}
