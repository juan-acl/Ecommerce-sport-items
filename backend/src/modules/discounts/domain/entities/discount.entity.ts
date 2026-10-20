export type DiscountType = 'percentage' | 'fixed';

export interface DiscountProps {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
  applicableCategories?: string[];
}

export class Discount {
  constructor(private readonly props: DiscountProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get type(): DiscountType { return this.props.type; }
  get value(): number { return this.props.value; }
  get minPurchase(): number { return this.props.minPurchase; }
  get maxUses(): number { return this.props.maxUses; }
  get usedCount(): number { return this.props.usedCount; }
  get isActive(): boolean { return this.props.isActive; }
  get expiresAt(): string | null { return this.props.expiresAt; }
  get createdAt(): string { return this.props.createdAt; }
  get createdBy(): string { return this.props.createdBy; }
  get applicableCategories(): string[] { return this.props.applicableCategories ?? []; }

  isValid(orderTotal: number, cartCategories?: string[]): boolean {
    if (!this.props.isActive) return false;
    if (this.props.expiresAt && new Date(this.props.expiresAt) < new Date()) return false;
    if (this.props.maxUses > 0 && this.props.usedCount >= this.props.maxUses) return false;
    if (orderTotal < this.props.minPurchase) return false;
    const scoped = this.props.applicableCategories;
    if (scoped && scoped.length > 0 && cartCategories) {
      const hasMatch = cartCategories.some((c) => scoped.includes(c));
      if (!hasMatch) return false;
    }
    return true;
  }

  calculateDiscount(subtotal: number): number {
    if (this.props.type === 'percentage') {
      return parseFloat((subtotal * this.props.value / 100).toFixed(2));
    }
    return parseFloat(Math.min(this.props.value, subtotal).toFixed(2));
  }

  withToggled(): Discount {
    return new Discount({ ...this.props, isActive: !this.props.isActive });
  }

  toJSON(): DiscountProps {
    return { ...this.props };
  }
}
