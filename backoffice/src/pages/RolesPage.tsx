import { useState, useEffect } from "react";
import { Shield, Lock, Plus, Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "@features/roles/api/rolesApi";
import { useGetUsersQuery } from "@features/users/api/usersApi";
import {
  SYSTEM_MODULES,
  ACTION_LABELS,
} from "@features/roles/constants/modules";
import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Modal } from "@shared/components/ui/Modal";
import { Input } from "@shared/components/ui/Input";
import { Spinner } from "@shared/components/ui/Spinner";
import type { RoleEntity, ModulePermission } from "@shared/types/common";

function PermissionMatrix({
  permissions,
}: {
  permissions: ModulePermission[];
}) {
  const getActions = (moduleId: string): string[] => {
    const entry = permissions.find((p) => p.module === moduleId);
    return entry?.actions ?? [];
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant">
            <th className="text-left py-2 pr-4 text-label-md text-on-surface-variant font-semibold">
              Módulo
            </th>
            {["view", "create", "edit", "delete"].map((action) => (
              <th
                key={action}
                className="text-center py-2 px-2 text-label-md text-on-surface-variant font-semibold w-16"
              >
                {ACTION_LABELS[action]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SYSTEM_MODULES.map((mod) => {
            const grantedActions = getActions(mod.id);
            return (
              <tr
                key={mod.id}
                className="border-b border-outline-variant/50 last:border-0"
              >
                <td className="py-2.5 pr-4">
                  <span className="text-body-md text-on-surface font-medium">
                    {mod.label}
                  </span>
                </td>
                {["view", "create", "edit", "delete"].map((action) => {
                  const supported = (mod.actions as readonly string[]).includes(
                    action,
                  );
                  const granted = supported && grantedActions.includes(action);
                  return (
                    <td key={action} className="text-center py-2.5 px-2">
                      {!supported ? (
                        <span className="text-on-surface-variant/30 text-xs">
                          —
                        </span>
                      ) : granted ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-secondary">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-container text-on-surface-variant/40">
                          <X size={12} strokeWidth={2} />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface PermissionEditorProps {
  value: ModulePermission[];
  onChange: (value: ModulePermission[]) => void;
}

function PermissionEditor({ value, onChange }: PermissionEditorProps) {
  const getActions = (moduleId: string): string[] => {
    return value.find((p) => p.module === moduleId)?.actions ?? [];
  };

  const toggleAction = (moduleId: string, action: string) => {
    const existing = getActions(moduleId);
    const updated = existing.includes(action)
      ? existing.filter((a) => a !== action)
      : [...existing, action];

    const next = value.filter((p) => p.module !== moduleId);
    if (updated.length > 0) {
      next.push({ module: moduleId, actions: updated });
    }
    onChange(next);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant">
            <th className="text-left py-2 pr-4 text-label-md text-on-surface-variant font-semibold">
              Módulo
            </th>
            {["view", "create", "edit", "delete"].map((action) => (
              <th
                key={action}
                className="text-center py-2 px-2 text-label-md text-on-surface-variant font-semibold w-16"
              >
                {ACTION_LABELS[action]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SYSTEM_MODULES.map((mod) => {
            const grantedActions = getActions(mod.id);
            return (
              <tr
                key={mod.id}
                className="border-b border-outline-variant/50 last:border-0"
              >
                <td className="py-2.5 pr-4">
                  <span className="text-body-md text-on-surface font-medium">
                    {mod.label}
                  </span>
                </td>
                {["view", "create", "edit", "delete"].map((action) => {
                  const supported = (mod.actions as readonly string[]).includes(
                    action,
                  );
                  const checked = supported && grantedActions.includes(action);
                  return (
                    <td key={action} className="text-center py-2.5 px-2">
                      {supported ? (
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAction(mod.id, action)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      ) : (
                        <span className="text-on-surface-variant/30 text-xs">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: RoleEntity | null;
}

function RoleFormModal({ isOpen, onClose, role }: RoleFormModalProps) {
  const isEditing = !!role;
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [permissions, setPermissions] = useState<ModulePermission[]>(
    role?.permissions ?? [],
  );
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(role?.name ?? "");
      setDescription(role?.description ?? "");
      setPermissions(role?.permissions ?? []);
      setNameError("");
    }
  }, [isOpen, role]);

  const handleSubmit = async () => {
    if (name.trim().length < 2) {
      setNameError("Mínimo 2 caracteres");
      return;
    }
    setNameError("");
    try {
      if (isEditing && role) {
        await updateRole({
          id: role.id,
          name,
          description,
          permissions,
        }).unwrap();
        toast.success("Rol actualizado correctamente.");
      } else {
        await createRole({ name, description, permissions }).unwrap();
        toast.success("Rol creado correctamente.");
      }
      onClose();
    } catch {
      toast.error("Error al guardar el rol. Intenta de nuevo.");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar rol" : "Nuevo rol"}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? "Guardar cambios" : "Crear rol"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          id="role-name"
          label="Nombre del rol"
          placeholder="Ej: supervisor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
        />
        <div className="space-y-1">
          <label
            htmlFor="role-description"
            className="block text-label-md text-on-surface-variant"
          >
            Descripción
          </label>
          <textarea
            id="role-description"
            rows={2}
            placeholder="Descripción del rol..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full py-2.5 px-3 bg-white border border-outline-variant rounded-md outline-none transition-colors hover:border-outline/60 focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary text-body-md text-on-surface resize-none"
          />
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant font-semibold mb-3">
            Permisos
          </p>
          <div className="border border-outline-variant rounded-xl p-3">
            <PermissionEditor value={permissions} onChange={setPermissions} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function RoleUsersSection({ roleName }: { roleName: string }) {
  const { data: usersData } = useGetUsersQuery({ limit: 100 });
  const allUsers = usersData?.items ?? [];
  const filtered = allUsers.filter((u) => u.role === roleName);
  const visible = filtered.slice(0, 8);
  const hasMore = filtered.length > 8;

  if (filtered.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant italic py-2">
        Ningún usuario tiene este rol actualmente.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="divide-y divide-outline-variant/50">
        {visible.map((user) => (
          <div key={user.id} className="flex items-center gap-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-md font-medium text-on-surface truncate">
                {user.name}
              </p>
              <p className="text-label-md text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
            <span className="text-label-md text-on-surface-variant flex-shrink-0">
              {new Date(user.createdAt).toLocaleDateString("es-GT")}
            </span>
          </div>
        ))}
      </div>
      {hasMore && (
        <p className="text-label-md text-primary cursor-pointer hover:underline pt-1">
          Ver todos ({filtered.length})
        </p>
      )}
    </div>
  );
}

export function RolesPage() {
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const { data: usersData } = useGetUsersQuery({ limit: 100 });
  const allUsers = usersData?.items ?? [];

  const [selectedRole, setSelectedRole] = useState<RoleEntity | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RoleEntity | null>(null);

  const handleNewRole = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEditRole = (role: RoleEntity) => {
    setEditTarget(role);
    setFormOpen(true);
  };

  const getUserCount = (roleName: string) =>
    allUsers.filter((u) => u.role === roleName).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <Shield size={20} strokeWidth={1.75} />
        </div>
        <div>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">Roles y Permisos</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">
          Gestión de acceso al sistema
        </p>
      </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-sm text-on-surface">Roles</h2>
            <Button size="sm" onClick={handleNewRole}>
              <Plus size={14} />
              Nuevo Rol
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : roles.length === 0 ? (
            <div className="bg-white border border-outline-variant rounded-xl p-6 text-center">
              <Shield
                size={32}
                className="text-on-surface-variant mx-auto mb-2"
              />
              <p className="text-body-md text-on-surface-variant">
                No hay roles definidos.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {roles.map((role) => {
                const isSelected = selectedRole?.id === role.id;
                const userCount = getUserCount(role.name);
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left bg-white border rounded-xl px-4 py-3.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                      isSelected
                        ? "border-primary ring-1 ring-primary bg-primary/5"
                        : "border-outline-variant hover:border-primary/40 hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body-md font-semibold text-on-surface capitalize">
                            {role.name}
                          </span>
                          {role.isSystem && (
                            <Lock
                              size={12}
                              className="text-on-surface-variant flex-shrink-0"
                            />
                          )}
                        </div>
                        {role.description && (
                          <p className="text-label-md text-on-surface-variant mt-0.5 truncate">
                            {role.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="default" className="flex-shrink-0">
                        {userCount} usuario{userCount !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="xl:col-span-8">
          {!selectedRole ? (
            <div className="bg-white border border-outline-variant rounded-lg flex flex-col items-center justify-center py-20 px-6 text-center h-full min-h-[300px]">
              <Shield size={40} className="text-on-surface-variant/40 mb-3" />
              <p className="text-headline-sm text-on-surface-variant">
                Selecciona un rol para ver sus permisos
              </p>
              <p className="text-body-md text-on-surface-variant/60 mt-1">
                Haz clic en cualquier rol del panel izquierdo
              </p>
            </div>
          ) : (
            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
              <div className="flex items-start justify-between px-6 py-5 border-b border-outline-variant">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-[#006b58]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-headline-sm text-on-surface capitalize">
                        {selectedRole.name}
                      </h2>
                      {selectedRole.isSystem && (
                        <Badge variant="default">
                          <Lock size={10} className="mr-1" />
                          Sistema
                        </Badge>
                      )}
                    </div>
                    {selectedRole.description && (
                      <p className="text-body-md text-on-surface-variant mt-0.5">
                        {selectedRole.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditRole(selectedRole)}
                >
                  <Pencil size={13} />
                  Editar
                </Button>
              </div>

              <div className="px-6 py-5 border-b border-outline-variant">
                <h3 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide mb-4">
                  Matriz de permisos
                </h3>
                <PermissionMatrix permissions={selectedRole.permissions} />
              </div>

              <div className="px-6 py-5">
                <h3 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide mb-4">
                  Usuarios con este rol ({getUserCount(selectedRole.name)})
                </h3>
                <RoleUsersSection roleName={selectedRole.name} />
              </div>
            </div>
          )}
        </div>
      </div>

      <RoleFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        role={editTarget}
      />
    </div>
  );
}
