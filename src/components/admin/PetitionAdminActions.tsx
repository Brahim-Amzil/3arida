'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Pause, Trash2 } from 'lucide-react';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Petition } from '@/types/petition';
import { notifyPetitionStatusChange } from '@/lib/notifications';
import { logAuditAction, AuditAction } from '@/lib/audit-log';
import { getUserById } from '@/lib/petitions';

interface PetitionAdminActionsProps {
  petition: Petition;
  onUpdate?: (updatedPetition: Petition) => void;
  size?: 'sm' | 'default';
  layout?: 'horizontal' | 'vertical';
  moderatorId?: string;
}

export default function PetitionAdminActions({
  petition,
  onUpdate,
  size = 'default',
  layout = 'horizontal',
  moderatorId,
}: PetitionAdminActionsProps) {
  const [updating, setUpdating] = useState<string>('');

  const updatePetitionStatus = async (
    action: 'approve' | 'reject' | 'pause' | 'delete',
    requiresConfirmation = false,
    requiresReason = false
  ) => {
    if (requiresConfirmation) {
      if (!confirm(`Are you sure you want to ${action} this petition?`)) {
        return;
      }
    }

    let notes = '';
    if (requiresReason) {
      const reasonPrompt =
        action === 'delete'
          ? 'Reason for deletion (required):'
          : `Reason for ${action} (optional):`;
      notes = prompt(reasonPrompt) || '';

      if (action === 'delete' && !notes.trim()) {
        alert('A reason is required for deletion.');
        return;
      }
    }

    setUpdating(action);
    try {
      const now = new Date();
      const updateData: any = {
        updatedAt: Timestamp.fromDate(now),
      };

      // Set status and timestamps based on action
      switch (action) {
        case 'approve':
          updateData.status = 'approved';
          updateData.approvedAt = Timestamp.fromDate(now);
          break;
        case 'reject':
          updateData.status = 'rejected';
          updateData.rejectedAt = Timestamp.fromDate(now);
          break;
        case 'pause':
          updateData.status = 'paused';
          updateData.pausedAt = Timestamp.fromDate(now);
          break;
        case 'delete':
          updateData.status = 'deleted';
          updateData.deletedAt = Timestamp.fromDate(now);
          updateData.isActive = false;
          break;
      }

      // Add moderation info
      if (moderatorId) {
        updateData.moderatedBy = moderatorId;
      }
      if (notes) {
        updateData.moderatorNotes = notes;
      }

      // If rejecting, add to resubmission history
      if (action === 'reject') {
        const resubmissionHistory = petition.resubmissionHistory || [];
        // Convert existing Date objects to plain objects for Firestore
        const historyForFirestore = resubmissionHistory.map((entry) => ({
          rejectedAt:
            entry.rejectedAt instanceof Date
              ? Timestamp.fromDate(entry.rejectedAt)
              : entry.rejectedAt,
          reason: entry.reason,
          resubmittedAt: entry.resubmittedAt
            ? entry.resubmittedAt instanceof Date
              ? Timestamp.fromDate(entry.resubmittedAt)
              : entry.resubmittedAt
            : null,
        }));

        // Add new rejection entry
        historyForFirestore.push({
          rejectedAt: Timestamp.fromDate(now),
          reason: notes || 'No reason provided',
          resubmittedAt: null, // Will be filled when user resubmits
        });

        updateData.resubmissionHistory = historyForFirestore;
      }

      // Update in Firestore
      await updateDoc(doc(db, 'petitions', petition.id), updateData);

      // Log the action to audit trail (async, won't block)
      if (moderatorId) {
        const actionMap: Record<string, AuditAction> = {
          approve: 'petition.approved',
          reject: 'petition.rejected',
          pause: 'petition.paused',
          delete: 'petition.deleted',
        };

        if (actionMap[action]) {
          try {
            const moderator = await getUserById(moderatorId);
            await logAuditAction({
              actorId: moderatorId,
              actorName: moderator?.name || 'Unknown Admin',
              actorEmail: moderator?.email || '',
              actorRole: (moderator?.role as 'admin' | 'moderator') || 'admin',
              action: actionMap[action],
              targetType: 'petition',
              targetId: petition.id,
              targetName: petition.title,
              details: {
                oldValue: petition.status,
                newValue: updateData.status,
                reason: notes,
              },
            });
            console.log('✅ Audit log created successfully');
          } catch (auditError) {
            console.error('❌ Error logging audit action:', auditError);
            // Don't fail the action if audit logging fails
          }
        }
      } else {
        console.warn('⚠️ No moderatorId provided for audit logging');
      }

      // Create updated petition object for local state
      const updatedPetition: Petition = {
        ...petition,
        status: updateData.status,
        updatedAt: now,
        moderatedBy: updateData.moderatedBy,
        moderationNotes: updateData.moderatorNotes,
        isActive:
          updateData.isActive !== undefined
            ? updateData.isActive
            : petition.isActive,
      };

      // Add timestamp fields
      if (updateData.approvedAt) updatedPetition.approvedAt = now;
      if (updateData.rejectedAt) updatedPetition.rejectedAt = now;
      if (updateData.pausedAt) updatedPetition.pausedAt = now;
      if (updateData.deletedAt) updatedPetition.deletedAt = now;

      // Send notification to petition creator
      try {
        await notifyPetitionStatusChange(
          petition.id,
          petition.creatorId,
          petition.title,
          updateData.status,
          notes
        );
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Don't fail the action if notification fails
      }

      // Update local state
      if (onUpdate) {
        onUpdate(updatedPetition);
      }

      // Show success message
      const actionPastTense = action === 'delete' ? 'deleted' : `${action}d`;
      alert(`Petition ${actionPastTense} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing petition:`, error);
      alert(`Error ${action}ing petition. Please try again.`);
    } finally {
      setUpdating('');
    }
  };

  const containerClass =
    layout === 'vertical' ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2';

  const isDisabled = (action: string) => updating === action || updating !== '';

  return (
    <div className={containerClass}>
      {/* Approve Button - Always show */}
      <Button
        size={size}
        onClick={() => updatePetitionStatus('approve')}
        disabled={isDisabled('approve') || petition.status === 'approved'}
        className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
      >
        <Check className="w-4 h-4 mr-2" />
        {updating === 'approve' ? 'Approving...' : 'Approve'}
      </Button>

      {/* Pause Button - Always show */}
      <Button
        size={size}
        onClick={() => updatePetitionStatus('pause', false, true)}
        disabled={
          isDisabled('pause') ||
          petition.status === 'paused' ||
          petition.status === 'deleted'
        }
        variant="outline"
        className="text-orange-600 border-orange-300 hover:bg-orange-50 disabled:text-gray-500 disabled:border-gray-300"
      >
        <Pause className="w-4 h-4 mr-2" />
        {updating === 'pause' ? 'Pausing...' : 'Pause'}
      </Button>

      {/* Reject Button - Always show */}
      <Button
        size={size}
        onClick={() => updatePetitionStatus('reject', true, true)}
        disabled={
          isDisabled('reject') ||
          petition.status === 'rejected' ||
          petition.status === 'deleted'
        }
        variant="destructive"
        className="disabled:bg-gray-300 disabled:text-gray-500"
      >
        <X className="w-4 h-4 mr-2" />
        {updating === 'reject' ? 'Rejecting...' : 'Reject'}
      </Button>

      {/* Delete Button - Always show */}
      <Button
        size={size}
        onClick={() => updatePetitionStatus('delete', true, true)}
        disabled={isDisabled('delete') || petition.status === 'deleted'}
        variant="outline"
        className="text-red-600 border-red-300 hover:bg-red-50 disabled:text-gray-500 disabled:border-gray-300"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {updating === 'delete' ? 'Deleting...' : 'Delete'}
      </Button>

      {/* Loading indicator */}
      {updating && (
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
          Processing...
        </div>
      )}
    </div>
  );
}
