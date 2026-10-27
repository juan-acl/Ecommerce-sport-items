#!/usr/bin/env ts-node
/**
 * Acceptance entrypoint generator.
 * Usage: ts-node scripts/generate-acceptance.ts <ir.json> <out.acceptance.test.ts> <steps-import>
 *
 * The IR JSON is produced by gherkin-parser.
 */

import * as fs from 'fs';
import * as path from 'path';

interface StepIR {
  keyword: string;
  text: string;
  parameters?: string[];
}

interface ScenarioIR {
  name: string;
  steps: StepIR[];
  examples: Record<string, string>[];
}

interface FeatureIR {
  name: string;
  background?: StepIR[];
  scenarios: ScenarioIR[];
}

function interpolate(text: string, row: Record<string, string>): string {
  return text.replace(/<([^>]+)>/g, (_, key) => row[key] ?? `<${key}>`);
}

function escape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function generateTestFile(ir: FeatureIR, stepsImport: string, stepsRegFn: string): string {
  const lines: string[] = [];

  lines.push(`import { AcceptanceRuntime } from '../runtime/acceptance-runtime';`);
  lines.push(`import { ${stepsRegFn} } from '${stepsImport}';`);
  lines.push('');
  lines.push(`describe(${JSON.stringify(ir.name)}, () => {`);
  lines.push(`  let rt: AcceptanceRuntime;`);
  lines.push('');
  lines.push(`  beforeEach(() => {`);
  lines.push(`    rt = new AcceptanceRuntime();`);
  lines.push(`    ${stepsRegFn}(rt);`);
  lines.push(`  });`);
  lines.push('');

  for (const scenario of ir.scenarios) {
    const rows = scenario.examples.length > 0 ? scenario.examples : [{}];

    for (const row of rows) {
      const exTitle = Object.entries(row).map(([k, v]) => `${k}=${v}`).join(', ');
      const testName = exTitle ? `${scenario.name} [${exTitle}]` : scenario.name;

      lines.push(`  it(${JSON.stringify(testName)}, async () => {`);
      lines.push(`    rt.reset();`);

      if (ir.background) {
        for (const s of ir.background) {
          lines.push(`    await rt.run(\`${escape(interpolate(s.text, row))}\`);`);
        }
      }

      for (const s of scenario.steps) {
        lines.push(`    await rt.run(\`${escape(interpolate(s.text, row))}\`);`);
      }

      lines.push(`  });`);
      lines.push('');
    }
  }

  lines.push(`});`);
  lines.push('');
  return lines.join('\n');
}

function main() {
  const [, , irPath, outPath, stepsImport, stepsRegFn] = process.argv;
  if (!irPath || !outPath || !stepsImport || !stepsRegFn) {
    console.error('Usage: ts-node generate-acceptance.ts <ir.json> <out.test.ts> <steps-import> <register-fn>');
    process.exit(1);
  }

  const ir: FeatureIR = JSON.parse(fs.readFileSync(irPath, 'utf-8'));
  const code = generateTestFile(ir, stepsImport, stepsRegFn);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, code, 'utf-8');
  console.log(`Generated: ${outPath}`);
}

main();
