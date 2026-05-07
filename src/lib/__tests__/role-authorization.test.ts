import {
  canAccessAdmin,
  canAccessModerator,
  hasRequiredRole,
  isAdminRole,
  isModeratorRole,
} from '../role-authorization';

describe('role-authorization', () => {
  describe('isAdminRole', () => {
    it('returns true for admin and master_admin', () => {
      expect(isAdminRole('admin')).toBe(true);
      expect(isAdminRole('master_admin')).toBe(true);
    });

    it('returns false for moderator/user/invalid roles', () => {
      expect(isAdminRole('moderator')).toBe(false);
      expect(isAdminRole('user')).toBe(false);
      expect(isAdminRole('unknown')).toBe(false);
      expect(isAdminRole(undefined)).toBe(false);
      expect(isAdminRole(null)).toBe(false);
    });
  });

  describe('isModeratorRole', () => {
    it('returns true for moderator/admin/master_admin', () => {
      expect(isModeratorRole('moderator')).toBe(true);
      expect(isModeratorRole('admin')).toBe(true);
      expect(isModeratorRole('master_admin')).toBe(true);
    });

    it('returns false for user and invalid roles', () => {
      expect(isModeratorRole('user')).toBe(false);
      expect(isModeratorRole('unknown')).toBe(false);
      expect(isModeratorRole(undefined)).toBe(false);
      expect(isModeratorRole(null)).toBe(false);
    });
  });

  describe('hasRequiredRole', () => {
    it('matches required role sets correctly', () => {
      expect(hasRequiredRole('user', ['user'])).toBe(true);
      expect(hasRequiredRole('moderator', ['moderator', 'admin'])).toBe(true);
      expect(hasRequiredRole('admin', ['moderator', 'admin'])).toBe(true);
      expect(hasRequiredRole('master_admin', ['master_admin'])).toBe(true);
    });

    it('returns false when role is not included', () => {
      expect(hasRequiredRole('user', ['moderator', 'admin'])).toBe(false);
      expect(hasRequiredRole(undefined, ['user'])).toBe(false);
      expect(hasRequiredRole(null, ['user'])).toBe(false);
    });
  });

  describe('convenience access helpers', () => {
    it('canAccessAdmin maps to admin-only access', () => {
      expect(canAccessAdmin('admin')).toBe(true);
      expect(canAccessAdmin('master_admin')).toBe(true);
      expect(canAccessAdmin('moderator')).toBe(false);
      expect(canAccessAdmin('user')).toBe(false);
    });

    it('canAccessModerator maps to moderator+ access', () => {
      expect(canAccessModerator('moderator')).toBe(true);
      expect(canAccessModerator('admin')).toBe(true);
      expect(canAccessModerator('master_admin')).toBe(true);
      expect(canAccessModerator('user')).toBe(false);
    });
  });
});
