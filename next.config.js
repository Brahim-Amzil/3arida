/* eslint @typescript-eslint/no-var-requires: "off" */
const { i18n } = require('./next-i18next.config');
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Force static export for Firebase deployment only
  ...(process.env.BUILD_TARGET === 'firebase' ? { output: 'export' } : {}),
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'boxyhq.com',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
    ],
  },
  // i18n is disabled for static export
  // i18n,
  // Only add rewrites when not using static export
  ...(!(process.env.NODE_ENV === 'production' && process.env.BUILD_TARGET === 'firebase') ? {
    rewrites: async () => {
      return [
        {
          source: '/.well-known/saml.cer',
          destination: '/api/well-known/saml.cer',
        },
        {
          source: '/.well-known/saml-configuration',
          destination: '/well-known/saml-configuration',
        },
      ];
    },
  } : {}),
  async headers() {
    return [
      {
        source: '/(.*?)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains;',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
};

// Additional config options for the Sentry webpack plugin.
// For all available options: https://github.com/getsentry/sentry-webpack-plugin#options.
const sentryWebpackPluginOptions = {
  silent: true,
  hideSourceMaps: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
