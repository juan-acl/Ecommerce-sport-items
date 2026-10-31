import { describe, it, expect } from 'vitest';
import { buildPdfHtml } from '../exportToPdf';

describe('buildPdfHtml', () => {
  it('includes the title in an h1 element', () => {
    const html = buildPdfHtml('My Report', [], []);
    expect(html).toContain('<h1>My Report</h1>');
  });

  it('renders each header as a th element', () => {
    const html = buildPdfHtml('T', ['Name', 'Value'], []);
    expect(html).toContain('<th>Name</th>');
    expect(html).toContain('<th>Value</th>');
  });

  it('renders each row as td elements inside a tr', () => {
    const html = buildPdfHtml('T', ['A'], [['foo'], ['bar']]);
    expect(html).toContain('<td>foo</td>');
    expect(html).toContain('<td>bar</td>');
  });

  it('escapes & < > in title and cell values', () => {
    const html = buildPdfHtml('R&D <report>', ['Col'], [['a & b'], ['x < y'], ['p > q']]);
    expect(html).toContain('R&amp;D &lt;report&gt;');
    expect(html).toContain('<td>a &amp; b</td>');
    expect(html).toContain('<td>x &lt; y</td>');
    expect(html).toContain('<td>p &gt; q</td>');
  });

  it('produces valid html skeleton with thead and tbody', () => {
    const html = buildPdfHtml('T', ['H'], [['v']]);
    expect(html).toContain('<thead>');
    expect(html).toContain('</thead>');
    expect(html).toContain('<tbody>');
    expect(html).toContain('</tbody>');
  });

  it('works with no rows, only headers', () => {
    const html = buildPdfHtml('Empty', ['Col1', 'Col2'], []);
    expect(html).toContain('<th>Col1</th>');
    expect(html).toContain('<th>Col2</th>');
    expect(html).not.toContain('<td>');
  });
});
