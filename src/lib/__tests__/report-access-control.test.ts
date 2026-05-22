import type { Petition } from '@/types/petition';
import {
  canGenerateReport,
  requiresPayment,
  getRemainingFreeDownloads,
  getDownloadPrice,
  getButtonState,
  isFreeTierLimitChoice,
  FREE_TIER_FREE_DOWNLOADS,
  PAID_TIER_FREE_DOWNLOADS,
  FREE_EXTRA_DOWNLOAD_PRICE_MAD,
  PAID_EXTRA_DOWNLOAD_PRICE_MAD,
} from '../report-access-control';

function basePetition(overrides: Partial<Petition> = {}): Petition {
  return {
    id: 'pet-1',
    creatorId: 'user-1',
    pricingTier: 'basic',
    reportDownloads: 0,
    ...overrides,
  } as Petition;
}

describe('report-access-control', () => {
  describe('canGenerateReport', () => {
    it('allows creator regardless of tier', () => {
      expect(canGenerateReport(basePetition({ pricingTier: 'free' }), 'user-1')).toEqual({
        allowed: true,
      });
    });

    it('denies non-creator', () => {
      expect(canGenerateReport(basePetition(), 'other-user').allowed).toBe(false);
    });
  });

  describe('requiresPayment', () => {
    it('free tier: no payment before 4 downloads', () => {
      expect(
        requiresPayment(
          basePetition({ pricingTier: 'free', reportDownloads: 3 }),
        ),
      ).toBe(false);
    });

    it('free tier: payment after 4 downloads', () => {
      expect(
        requiresPayment(
          basePetition({ pricingTier: 'free', reportDownloads: 4 }),
        ),
      ).toBe(true);
    });

    it('paid tier: no payment before 10 downloads', () => {
      expect(
        requiresPayment(
          basePetition({ pricingTier: 'basic', reportDownloads: 9 }),
        ),
      ).toBe(false);
    });

    it('paid tier: payment after 10 downloads', () => {
      expect(
        requiresPayment(
          basePetition({ pricingTier: 'basic', reportDownloads: 10 }),
        ),
      ).toBe(true);
    });
  });

  describe('getRemainingFreeDownloads', () => {
    it('returns correct remaining for free tier', () => {
      expect(
        getRemainingFreeDownloads(
          basePetition({ pricingTier: 'free', reportDownloads: 2 }),
        ),
      ).toBe(2);
    });

    it('returns correct remaining for paid tier', () => {
      expect(
        getRemainingFreeDownloads(
          basePetition({ pricingTier: 'basic', reportDownloads: 7 }),
        ),
      ).toBe(3);
    });
  });

  describe('getDownloadPrice', () => {
    it('returns 19 MAD for free tier over quota', () => {
      expect(
        getDownloadPrice(
          basePetition({ pricingTier: 'free', reportDownloads: 4 }),
        ),
      ).toBe(FREE_EXTRA_DOWNLOAD_PRICE_MAD);
    });

    it('returns 10 MAD for paid tier over quota', () => {
      expect(
        getDownloadPrice(
          basePetition({ pricingTier: 'basic', reportDownloads: 10 }),
        ),
      ).toBe(PAID_EXTRA_DOWNLOAD_PRICE_MAD);
    });

    it('returns 0 when free downloads remain', () => {
      expect(getDownloadPrice(basePetition({ reportDownloads: 0 }))).toBe(0);
    });
  });

  describe('getButtonState', () => {
    it('shows free badge with remaining count', () => {
      const state = getButtonState(
        basePetition({ pricingTier: 'free', reportDownloads: 1 }),
      );
      expect(state.onClick).toBe('generate');
      expect(state.badgeText).toContain('3');
    });

    it('shows limit choice for free tier at quota', () => {
      const state = getButtonState(
        basePetition({ pricingTier: 'free', reportDownloads: 4 }),
      );
      expect(state.onClick).toBe('limit_choice');
      expect(state.badge).toBe('choice');
    });

    it('shows payment for paid tier at quota', () => {
      const state = getButtonState(
        basePetition({ pricingTier: 'basic', reportDownloads: 10 }),
      );
      expect(state.onClick).toBe('payment');
      expect(state.badgeText).toContain('10');
    });
  });

  describe('isFreeTierLimitChoice', () => {
    it('true only for free tier at quota', () => {
      expect(
        isFreeTierLimitChoice(
          basePetition({ pricingTier: 'free', reportDownloads: 4 }),
        ),
      ).toBe(true);
      expect(
        isFreeTierLimitChoice(
          basePetition({ pricingTier: 'basic', reportDownloads: 10 }),
        ),
      ).toBe(false);
    });
  });

  describe('constants', () => {
    it('exports expected quota values', () => {
      expect(FREE_TIER_FREE_DOWNLOADS).toBe(4);
      expect(PAID_TIER_FREE_DOWNLOADS).toBe(10);
    });
  });
});
