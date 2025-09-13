import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { type ReactElement, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { AuthLayout } from '@/components/layouts';
import type { NextPageWithLayout } from 'types';
import { Loading, InputWithLabel } from '@/components/shared';
import env from '@/lib/env';
import { useFormik } from 'formik';
import Link from 'next/link';
import { Button } from 'react-daisyui';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import Head from 'next/head';
import { maxLengthPolicies } from '@/lib/common';

const SSO: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>SSO Login</title>
      </Head>
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">SSO Not Available</h2>
        <p className="text-gray-600 mb-4">
          Single Sign-On functionality requires server-side rendering and is not available in static export mode.
        </p>
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
          Back to Login
        </Link>
      </div>
    </>
  );
};

SSO.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout
      heading="signin-with-saml-sso"
      description="desc-signin-with-saml-sso"
    >
      {page}
    </AuthLayout>
  );
};



export default SSO;
