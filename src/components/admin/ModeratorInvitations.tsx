'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Invitation {
  id: string;
  email: string;
  name: string;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  status: string;
}

interface ModeratorInvitationsProps {
  currentUserEmail?: string;
}

export default function ModeratorInvitations({
  currentUserEmail,
}: ModeratorInvitationsProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const response = await fetch('/api/admin/invite-moderator');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendInvitation = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: t('admin.invitations.invalidEmail') });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: t('admin.invitations.invalidEmail') });
      return;
    }

    try {
      setSending(true);
      setMessage(null);

      const response = await fetch('/api/admin/invite-moderator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          invitedBy: currentUserEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: t('admin.invitations.success') });
        setEmail('');
        setName('');
        loadInvitations(); // Reload invitations
      } else {
        if (response.status === 409) {
          setMessage({
            type: 'error',
            text: t('admin.invitations.alreadyExists'),
          });
        } else {
          setMessage({
            type: 'error',
            text: data.error || t('admin.invitations.error'),
          });
        }
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setMessage({ type: 'error', text: t('admin.invitations.error') });
    } finally {
      setSending(false);
    }
  };

  const resendInvitation = async (
    invitationId: string,
    invitationEmail: string,
    invitationName: string
  ) => {
    try {
      const response = await fetch('/api/admin/invite-moderator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: invitationEmail,
          name: invitationName,
          invitedBy: currentUserEmail,
          resend: true,
        }),
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Invitation resent successfully!',
        });
        loadInvitations();
      } else {
        const data = await response.json();
        setMessage({
          type: 'error',
          text: data.error || 'Failed to resend invitation',
        });
      }
    } catch (error) {
      console.error('Error resending invitation:', error);
      setMessage({ type: 'error', text: 'Failed to resend invitation' });
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/invite-moderator/${invitationId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Invitation cancelled successfully!',
        });
        loadInvitations();
      } else {
        const data = await response.json();
        setMessage({
          type: 'error',
          text: data.error || 'Failed to cancel invitation',
        });
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      setMessage({ type: 'error', text: 'Failed to cancel invitation' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Send New Invitation */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.invitations.title')}</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            {t('admin.invitations.subtitle')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.invitations.emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.invitations.emailPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={sending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.invitations.nameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('admin.invitations.namePlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={sending}
              />
            </div>
          </div>

          <Button
            onClick={sendInvitation}
            disabled={sending || !email.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('admin.invitations.sending')}
              </>
            ) : (
              t('admin.invitations.sendInvitation')
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.invitations.pendingInvitations')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingInvitations ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : invitations.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              {t('admin.invitations.noInvitations')}
            </p>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {invitation.name || invitation.email}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {invitation.email}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>
                          {t('admin.invitations.invitedBy')}:{' '}
                          {invitation.invitedBy}
                        </span>
                        <span>
                          {t('admin.invitations.invitedAt')}:{' '}
                          {new Date(invitation.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        resendInvitation(
                          invitation.id,
                          invitation.email,
                          invitation.name
                        )
                      }
                    >
                      {t('admin.invitations.resend')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelInvitation(invitation.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {t('admin.invitations.cancel')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
