export type AuthorizationRole = 'user' | 'moderator' | 'admin' | 'master_admin';

export function isAdminRole(role: string | null | undefined): boolean {
  return role === 'admin' || role === 'master_admin';
}

export function isModeratorRole(role: string | null | undefined): boolean {
  return role === 'moderator' || isAdminRole(role);
}

export function hasRequiredRole(
  role: string | null | undefined,
  requiredRoles: AuthorizationRole[],
): boolean {
  if (!role) return false;
  return requiredRoles.includes(role as AuthorizationRole);
}

export function canAccessAdmin(role: string | null | undefined): boolean {
  return isAdminRole(role);
}

export function canAccessModerator(role: string | null | undefined): boolean {
  return isModeratorRole(role);
}
