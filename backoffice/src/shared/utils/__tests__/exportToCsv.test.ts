import { describe, it, expect } from 'vitest';
import { buildCsvContent } from '../exportToCsv';

describe('buildCsvContent', () => {
  it('wraps every cell in double quotes', () => {
    const result = buildCsvContent(['Name', 'Value'], [['Product A', '100']]);
    expect(result).toBe('"Name","Value"\n"Product A","100"');
  });

  it('escapes double quotes inside cell values by doubling them', () => {
    const result = buildCsvContent(['Title'], [['"Special"']]);
    expect(result).toBe('"Title"\n"""Special"""');
  });

  it('preserves commas inside cell values without breaking columns', () => {
    const result = buildCsvContent(['Desc'], [['Hello, World']]);
    expect(result).toBe('"Desc"\n"Hello, World"');
  });

  it('produces multiple rows separated by newlines', () => {
    const result = buildCsvContent(['A', 'B'], [['1', '2'], ['3', '4']]);
    const lines = result.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe('"A","B"');
    expect(lines[1]).toBe('"1","2"');
    expect(lines[2]).toBe('"3","4"');
  });

  it('produces only a header row when rows array is empty', () => {
    const result = buildCsvContent(['H1', 'H2'], []);
    expect(result).toBe('"H1","H2"');
  });
});
