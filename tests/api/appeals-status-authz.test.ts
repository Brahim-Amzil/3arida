/**
 * @jest-environment node
 */
/**
 * Route-level authorization checks for PATCH /api/appeals/[id]/status
 * (moderator/admin/master_admin vs plain user).
 */
import { NextRequest } from 'next/server';
import { PATCH } from '@/app/api/appeals/[id]/status/route';

jest.mock('@/lib/appeals-service-admin', () => ({
  getAppealAdmin: jest.fn(),
  updateAppealStatusAdmin: jest.fn(),
}));

import {
  getAppealAdmin,
  updateAppealStatusAdmin,
} from '@/lib/appeals-service-admin';

function patchRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/appeals/appeal-1/status', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validBase = {
  status: 'resolved',
  reason: 'ok',
  userId: 'user-1',
  userName: 'Tester',
};

describe('PATCH /api/appeals/[id]/status authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAppealAdmin as jest.Mock).mockResolvedValue({
      petitionId: 'p1',
      creatorEmail: 'c@example.com',
    });
    (updateAppealStatusAdmin as jest.Mock).mockResolvedValue(undefined);
  });

  it('returns 400 when required body fields are missing', async () => {
    const res = await PATCH(patchRequest({ status: 'resolved' }), {
      params: { id: 'appeal-1' },
    });
    expect(res.status).toBe(400);
  });

  it('returns 403 for plain user role', async () => {
    const res = await PATCH(
      patchRequest({
        ...validBase,
        userRole: 'user',
      }),
      { params: { id: 'appeal-1' } },
    );
    expect(res.status).toBe(403);
    expect(getAppealAdmin).not.toHaveBeenCalled();
  });

  it('returns 403 for unknown elevated-looking string', async () => {
    const res = await PATCH(
      patchRequest({
        ...validBase,
        userRole: 'superuser',
      }),
      { params: { id: 'appeal-1' } },
    );
    expect(res.status).toBe(403);
    expect(getAppealAdmin).not.toHaveBeenCalled();
  });

  it.each(['moderator', 'admin', 'master_admin'] as const)(
    'allows %s and calls admin services',
    async (userRole) => {
      const res = await PATCH(
        patchRequest({
          ...validBase,
          userRole,
        }),
        { params: { id: 'appeal-1' } },
      );
      expect(res.status).toBe(200);
      expect(getAppealAdmin).toHaveBeenCalledWith(
        'appeal-1',
        validBase.userId,
        userRole,
      );
      expect(updateAppealStatusAdmin).toHaveBeenCalled();
    },
  );
});
