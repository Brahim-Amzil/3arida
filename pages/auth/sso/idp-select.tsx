import { AuthLayout } from '@/components/layouts';
import { LetterAvatar } from '@/components/shared';
import jackson from '@/lib/jackson';
import { SAMLSSORecord } from '@boxyhq/saml-jackson';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';

interface IdPSelectionProps {
  connections: SAMLSSORecord[];
}

export default function IdPSelection() {
  // For static export, we'll show a message that SSO is not available
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-semibold mb-4">SSO Not Available</h2>
      <p className="text-gray-600">
        Single Sign-On functionality requires server-side rendering and is not available in static export mode.
      </p>
    </div>
  );
}

IdPSelection.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="welcome-back" description="log-in-to-account">
      {page}
    </AuthLayout>
  );
};
