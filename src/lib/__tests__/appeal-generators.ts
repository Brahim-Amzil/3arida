/**
 * Property-based testing generators for appeals system
 * Uses fast-check to generate random test data
 */

import * as fc from 'fast-check';
import {
  Appeal,
  AppealMessage,
  AppealStatus,
  StatusChange,
} from '@/types/appeal';

// Generator for AppealStatus
export const appealStatusArb = (): fc.Arbitrary<AppealStatus> =>
  fc.constantFrom<AppealStatus>(
    'pending',
    'in-progress',
    'resolved',
    'rejected'
  );

// Generator for AppealMessage
export const appealMessageArb = (): fc.Arbitrary<AppealMessage> =>
  fc.record({
    id: fc.uuid(),
    senderId: fc.uuid(),
    senderName: fc.string({ minLength: 1, maxLength: 50 }),
    senderRole: fc.constantFrom<'creator' | 'moderator'>(
      'creator',
      'moderator'
    ),
    content: fc.string({ minLength: 1, maxLength: 5000 }),
    createdAt: fc.date(),
    isInternal: fc.option(fc.boolean(), { nil: undefined }),
  });

// Generator for StatusChange
export const statusChangeArb = (): fc.Arbitrary<StatusChange> =>
  fc.record({
    status: appealStatusArb(),
    changedBy: fc.uuid(),
    changedAt: fc.date(),
    reason: fc.option(fc.string({ minLength: 1, maxLength: 500 }), {
      nil: undefined,
    }),
  });

// Generator for Appeal
export const appealArb = (): fc.Arbitrary<Appeal> =>
  fc.record({
    id: fc.uuid(),
    petitionId: fc.uuid(),
    petitionTitle: fc.string({ minLength: 5, maxLength: 200 }),
    creatorId: fc.uuid(),
    creatorName: fc.string({ minLength: 1, maxLength: 50 }),
    creatorEmail: fc.emailAddress(),
    status: appealStatusArb(),
    messages: fc.array(appealMessageArb(), { minLength: 1, maxLength: 20 }),
    statusHistory: fc.array(statusChangeArb(), { minLength: 1, maxLength: 10 }),
    createdAt: fc.date(),
    updatedAt: fc.date(),
    resolvedAt: fc.option(fc.date(), { nil: undefined }),
    resolvedBy: fc.option(fc.uuid(), { nil: undefined }),
    resolutionNotes: fc.option(fc.string({ minLength: 1, maxLength: 1000 }), {
      nil: undefined,
    }),
  });

// Generator for Appeal with specific status
export const appealWithStatusArb = (
  status: AppealStatus
): fc.Arbitrary<Appeal> => appealArb().map((appeal) => ({ ...appeal, status }));

// Generator for Appeal with specific creator
export const appealWithCreatorArb = (creatorId: string): fc.Arbitrary<Appeal> =>
  appealArb().map((appeal) => ({ ...appeal, creatorId }));

// Generator for non-empty message content
export const nonEmptyMessageArb = (): fc.Arbitrary<string> =>
  fc.string({ minLength: 1, maxLength: 5000 });

// Generator for empty or whitespace-only message content
export const emptyOrWhitespaceMessageArb = (): fc.Arbitrary<string> =>
  fc.oneof(
    fc.constant(''),
    fc.constant('   '),
    fc.constant('\t\t'),
    fc.constant('\n\n'),
    fc.constant('  \t  \n  ')
  );

// Generator for petition status that allows appeals
export const appealablePetitionStatusArb = (): fc.Arbitrary<
  'paused' | 'rejected'
> => fc.constantFrom<'paused' | 'rejected'>('paused', 'rejected');

// Generator for petition status that doesn't allow appeals
export const nonAppealablePetitionStatusArb = (): fc.Arbitrary<string> =>
  fc.constantFrom('draft', 'pending', 'approved', 'archived', 'deleted');

// Generator for user role
export const userRoleArb = (): fc.Arbitrary<'user' | 'moderator' | 'admin'> =>
  fc.constantFrom<'user' | 'moderator' | 'admin'>('user', 'moderator', 'admin');

// Generator for moderator role
export const moderatorRoleArb = (): fc.Arbitrary<'moderator' | 'admin'> =>
  fc.constantFrom<'moderator' | 'admin'>('moderator', 'admin');

// Helper to generate appeals with chronologically ordered status history
export const appealWithOrderedHistoryArb = (): fc.Arbitrary<Appeal> =>
  appealArb().map((appeal) => {
    // Sort status history by date
    const sortedHistory = [...appeal.statusHistory].sort(
      (a, b) => a.changedAt.getTime() - b.changedAt.getTime()
    );
    return { ...appeal, statusHistory: sortedHistory };
  });

// Helper to generate appeal with first message from creator
export const newAppealArb = (): fc.Arbitrary<Appeal> =>
  fc.record({
    id: fc.uuid(),
    petitionId: fc.uuid(),
    petitionTitle: fc.string({ minLength: 5, maxLength: 200 }),
    creatorId: fc.uuid(),
    creatorName: fc.string({ minLength: 1, maxLength: 50 }),
    creatorEmail: fc.emailAddress(),
    status: fc.constant<AppealStatus>('pending'),
    messages: fc.array(
      fc.record({
        id: fc.uuid(),
        senderId: fc.uuid(),
        senderName: fc.string({ minLength: 1, maxLength: 50 }),
        senderRole: fc.constant<'creator'>('creator'),
        content: fc.string({ minLength: 1, maxLength: 5000 }),
        createdAt: fc.date(),
        isInternal: fc.constant(undefined),
      }),
      { minLength: 1, maxLength: 1 }
    ),
    statusHistory: fc.array(
      fc.record({
        status: fc.constant<AppealStatus>('pending'),
        changedBy: fc.uuid(),
        changedAt: fc.date(),
        reason: fc.constant(undefined),
      }),
      { minLength: 1, maxLength: 1 }
    ),
    createdAt: fc.date(),
    updatedAt: fc.date(),
    resolvedAt: fc.constant(undefined),
    resolvedBy: fc.constant(undefined),
    resolutionNotes: fc.constant(undefined),
  });
