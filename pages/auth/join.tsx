import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { type ReactElement, useEffect } from 'react';
import type { NextPageWithLayout } from 'types';
import { authProviderEnabled } from '@/lib/auth';
import { AuthLayout } from '@/components/layouts';
import GithubButton from '@/components/auth/GithubButton';
import GoogleButton from '@/components/auth/GoogleButton';
import { Join } from '@/components/auth';
import Head from 'next/head';
import { Loading } from '@/components/shared';
import env from '@/lib/env';

const Signup: NextPageWithLayout = () => {
  const router = useRouter();
  const session = useSession();
  const status = session?.status || 'loading';
  const { t } = useTranslation('common');
  const authProviders = authProviderEnabled();

  const { error, token } = router.query as {
    error: string;
    token: string;
  };

  useEffect(() => {
    if (error) {
      toast.error(t(error));
    }
  }, [error, t]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'authenticated') {
    router.push(env.redirectIfAuthenticated);
  }

  const params = token ? `?token=${token}` : '';

  return (
    <>
      <Head>
        <title>{t('sign-up-title')}</title>
      </Head>
      <div className="rounded p-6 border">
        <div className="flex gap-2 flex-wrap">
          {authProviders.github && <GithubButton />}
          {authProviders.google && <GoogleButton />}
        </div>

        {(authProviders.github || authProviders.google) &&
          authProviders.credentials && <div className="divider">{t('or')}</div>}

        {authProviders.credentials && (
          <Join recaptchaSiteKey={env.recaptcha.siteKey} />
        )}
      </div>
      <p className="text-center text-sm text-gray-600 mt-3">
        {t('already-have-an-account')}
        <Link
          href={`/auth/login/${params}`}
          className="font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]"
        >
          &nbsp;{t('sign-in')}
        </Link>
      </p>
    </>
  );
};

Signup.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="get-started" description="create-a-new-account">
      {page}
    </AuthLayout>
  );
};



export default Signup;
