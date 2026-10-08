export interface ModulePermission {
  module: string;
  actions: string[];
}

export interface RoleProps {
  id: string;
  name: string;
  description: string;
  permissions: ModulePermission[];
  isSystem: boolean;
  createdAt: string;
}

export class Role {
  constructor(private readonly props: RoleProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get permissions(): ModulePermission[] {
    return this.props.permissions;
  }

  get isSystem(): boolean {
    return this.props.isSystem;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  toJSON(): RoleProps {
    return { ...this.props };
  }
}
