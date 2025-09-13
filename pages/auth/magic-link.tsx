import MagicLink from '@/components/auth/MagicLink';
import { AuthLayout } from '@/components/layouts';
import { getCsrfToken } from 'next-auth/react';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { NextPageWithLayout } from 'types';

const Login: NextPageWithLayout = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    getCsrfToken().then(token => {
      if (token) setCsrfToken(token);
    });
  }, []);

  return <MagicLink csrfToken={csrfToken} />;
};

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="welcome-back" description="log-in-to-account">
      {page}
    </AuthLayout>
  );
};



export default Login;
