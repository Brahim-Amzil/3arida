import { Button } from 'react-daisyui';
import { useState, type ReactElement, useEffect } from 'react';
import type { ComponentStatus } from 'react-daisyui/dist/types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Alert } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { AuthLayout } from '@/components/layouts';
import type { NextPageWithLayout } from 'types';

interface Message {
  text: string | null;
  status: ComponentStatus | null;
}

const UnlockAccount: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation('common');
  const [message, setMessage] = useState<Message>({ text: null, status: null });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (token && typeof token === 'string') {
      processUnlockToken(token);
    }
  }, [token]);

  const processUnlockToken = async (unlockToken: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/auth/unlock-account', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({ token: unlockToken }),
      });

      const { data, error } = await response.json();

      if (error) {
        setMessage({ text: error.message, status: 'error' });
      } else if (data) {
        setMessage({ text: 'Account unlocked successfully!', status: 'success' });
        setTimeout(() => {
          router.push('/auth/login?success=account-unlocked');
        }, 2000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to unlock account', status: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded p-6 border">
        <Alert status="error">Invalid or missing unlock token</Alert>
      </div>
    );
  }

  return (
    <div className="rounded p-6 border">
      <div className="space-y-3">
        {isProcessing && (
          <Alert status="info">Processing unlock request...</Alert>
        )}
        {message.text && (
          <Alert status={message.status || 'info'}>{message.text}</Alert>
        )}
      </div>
    </div>
  );
};

UnlockAccount.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout heading="unlock-account">{page}</AuthLayout>;
};



export default UnlockAccount;
