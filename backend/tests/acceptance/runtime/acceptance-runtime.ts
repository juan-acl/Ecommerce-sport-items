export type StepFn = (match: RegExpMatchArray, ctx: Record<string, unknown>) => Promise<void> | void;

interface StepDef {
  pattern: RegExp;
  fn: StepFn;
}

export class AcceptanceRuntime {
  private defs: StepDef[] = [];
  readonly ctx: Record<string, unknown> = {};

  step(pattern: RegExp, fn: StepFn): this {
    this.defs.push({ pattern, fn });
    return this;
  }

  async run(text: string): Promise<void> {
    for (const def of this.defs) {
      const m = text.match(def.pattern);
      if (m) {
        await def.fn(m, this.ctx);
        return;
      }
    }
    throw new Error(`Unmatched step: ${text}`);
  }

  reset(): void {
    for (const key of Object.keys(this.ctx)) {
      delete this.ctx[key];
    }
  }
}
