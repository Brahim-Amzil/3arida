import { ResetPasswordForm } from '@/components/auth';
import { AuthLayout } from '@/components/layouts';

import { ReactElement } from 'react';
import type { NextPageWithLayout } from 'types';

const ResetPasswordPage: NextPageWithLayout = () => {
  return <ResetPasswordForm />;
};

ResetPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="reset-password" description="enter-new-password">
      {page}
    </AuthLayout>
  );
};



export default ResetPasswordPage;
