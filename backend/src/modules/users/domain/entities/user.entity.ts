export interface UserProps {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  toJSON(): Omit<UserProps, 'passwordHash'> {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      createdAt: this.props.createdAt,
    };
  }
}
