import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import type { NextPageWithLayout } from 'types';

const SPConfig: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  // For static export, show a message that SAML is not available
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-semibold mb-4">SAML Configuration Not Available</h2>
      <p className="text-gray-600">
        SAML configuration requires server-side rendering and is not available in static export mode.
      </p>
    </div>
  );
};

SPConfig.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};



export default SPConfig;
