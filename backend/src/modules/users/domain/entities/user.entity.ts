export type UserRole = string;

export interface UserProps {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  isActive?: boolean;
  deletedAt?: string;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get name(): string { return this.props.name; }
  get passwordHash(): string { return this.props.passwordHash; }
  get role(): UserRole { return this.props.role; }
  get createdAt(): string { return this.props.createdAt; }
  get isActive(): boolean { return this.props.isActive ?? true; }
  get deletedAt(): string | undefined { return this.props.deletedAt; }

  deactivate(): User {
    return new User({
      ...this.props,
      isActive: false,
      deletedAt: new Date().toISOString(),
    });
  }

  toJSON(): Omit<UserProps, 'passwordHash'> {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      role: this.props.role,
      createdAt: this.props.createdAt,
      isActive: this.isActive,
      ...(this.props.deletedAt && { deletedAt: this.props.deletedAt }),
    };
  }
}
