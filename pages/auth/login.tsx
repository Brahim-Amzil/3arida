;
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from 'types';
import type { ComponentStatus } from 'react-daisyui/dist/types';

import * as Yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import { useFormik } from 'formik';
import { Button } from 'react-daisyui';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

import { AuthLayout } from '@/components/layouts';
import { authProviderEnabled } from '@/lib/auth';
import { getCsrfToken, signIn, useSession } from '@/lib/firebase/useFirebaseAuth';
import GithubButton from '@/components/auth/GithubButton';
import GoogleButton from '@/components/auth/GoogleButton';
import { Alert, InputWithLabel, Loading } from '@/components/shared';
import env from '@/lib/env';
import TogglePasswordVisibility from '@/components/shared/TogglePasswordVisibility';
import AgreeMessage from '@/components/auth/AgreeMessage';
import GoogleReCAPTCHA from '@/components/shared/GoogleReCAPTCHA';
import { maxLengthPolicies } from '@/lib/common';

interface Message {
  text: string | null;
  status: ComponentStatus | null;
}

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const session = useSession();
  const status = session?.status || 'loading';
  const { t } = useTranslation('common');
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [message, setMessage] = useState<Message>({ text: null, status: null });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const authProviders = authProviderEnabled();
  const recaptchaSiteKey = env.recaptcha.siteKey;

  useEffect(() => {
    getCsrfToken().then(token => {
      if (token) setCsrfToken(token);
    });
  }, []);

  const { error, success, token } = router.query as {
    error: string;
    success: string;
    token: string;
  };

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (error) {
      setMessage({ text: error, status: 'error' });
    }

    if (success) {
      setMessage({ text: success, status: 'success' });
    }
  }, [error, success]);

  const redirectUrl = token
    ? `/invitations/${token}`
    : env.redirectIfAuthenticated;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required().email().max(maxLengthPolicies.email),
      password: Yup.string().required().max(maxLengthPolicies.password),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;

      setMessage({ text: null, status: null });

      try {
        const signInData: any = {
          email,
          password,
          csrfToken,
          redirect: false,
          callbackUrl: redirectUrl,
        };
        
        // Only include recaptchaToken if reCAPTCHA is enabled
        if (recaptchaSiteKey && recaptchaToken) {
          signInData.recaptchaToken = recaptchaToken;
        }
        
        const response = await signIn('credentials', signInData);

        formik.resetForm();
        recaptchaRef.current?.reset();

        if (response && typeof response === 'object' && 'ok' in response && !response.ok) {
          setMessage({ text: response.error || 'Login failed', status: 'error' });
          return;
        }

        // If successful, redirect will be handled by useSession hook
      } catch (error: any) {
        setMessage({ text: error.message || 'Login failed', status: 'error' });
      }
    },
  });

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'authenticated') {
    router.push(redirectUrl);
    return <Loading />;
  }

  const params = token ? `?token=${token}` : '';

  return (
    <>
      <Head>
        <title>{t('login-title')}</title>
      </Head>
      {message.text && message.status && (
        <Alert status={message.status} className="mb-5">
          {t(message.text)}
        </Alert>
      )}
      <div className="rounded p-6 border">
        <div className="flex gap-2 flex-wrap">
          {authProviders.github && <GithubButton />}
          {authProviders.google && <GoogleButton />}
        </div>

        {(authProviders.github || authProviders.google) &&
          authProviders.credentials && <div className="divider">{t('or')}</div>}

        {authProviders.credentials && (
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-3">
              <InputWithLabel
                type="email"
                label="Email"
                name="email"
                placeholder={t('email')}
                value={formik.values.email}
                error={formik.touched.email ? formik.errors.email : undefined}
                onChange={formik.handleChange}
              />
              <div className="relative flex">
                <InputWithLabel
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  placeholder={t('password')}
                  value={formik.values.password}
                  label={
                    <label className="label">
                      <span className="label-text">{t('password')}</span>
                      <span className="label-text-alt">
                        <Link
                          href="/auth/forgot-password"
                          className="text-sm text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]"
                        >
                          {t('forgot-password')}
                        </Link>
                      </span>
                    </label>
                  }
                  error={
                    formik.touched.password ? formik.errors.password : undefined
                  }
                  onChange={formik.handleChange}
                />
                <TogglePasswordVisibility
                  isPasswordVisible={isPasswordVisible}
                  handlePasswordVisibility={handlePasswordVisibility}
                />
              </div>
              <GoogleReCAPTCHA
                recaptchaRef={recaptchaRef}
                onChange={setRecaptchaToken}
                siteKey={recaptchaSiteKey}
              />
            </div>
            <div className="mt-3 space-y-3">
              <Button
                type="submit"
                color="primary"
                loading={formik.isSubmitting}
                active={formik.dirty}
                fullWidth
                size="md"
              >
                {t('sign-in')}
              </Button>
              <AgreeMessage text={t('sign-in')} />
            </div>
          </form>
        )}

        {(authProviders.email || authProviders.saml) && (
          <div className="divider"></div>
        )}

        <div className="space-y-3">
          {authProviders.email && (
            <Link
              href={`/auth/magic-link${params}`}
              className="btn btn-outline w-full"
            >
              &nbsp;{t('sign-in-with-email')}
            </Link>
          )}

          {authProviders.saml && (
            <Link href="/auth/sso" className="btn btn-outline w-full">
              &nbsp;{t('continue-with-saml-sso')}
            </Link>
          )}
        </div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-3">
        {t('dont-have-an-account')}
        <Link
          href={`/auth/join${params}`}
          className="font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]"
        >
          &nbsp;{t('create-a-free-account')}
        </Link>
      </p>
    </>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="welcome-back" description="log-in-to-account">
      {page}
    </AuthLayout>
  );
};



export default LoginPage;
