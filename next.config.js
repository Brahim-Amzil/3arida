// Next.js automatically loads .env.local - no need for manual dotenv loading

const defaultRuntimeCaching = require('next-pwa/cache');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disabled in dev, enabled in production
  runtimeCaching: [
    // Never cache API responses in Service Worker to avoid stale/misleading data.
    {
      urlPattern: /^https?.*\/api\/.*$/i,
      handler: 'NetworkOnly',
      method: 'GET',
    },
    ...defaultRuntimeCaching.filter(
      (entry) =>
        !String(entry?.urlPattern || '').includes('pathname.startsWith("/api/")'),
    ),
  ],
});

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint enabled during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // We already verified TypeScript is clean
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com', // Google profile images
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Security headers and manifest configuration
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.paypalobjects.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://apis.google.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.stripe.com https://www.paypal.com https://www.paypalobjects.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://apis.google.com https://www.googletagmanager.com https://*.googleapis.com; frame-src 'self' https://js.stripe.com https://www.paypal.com https://www.google.com https://accounts.google.com https://www.recaptcha.net https://arida-c5faf.firebaseapp.com https://*.firebaseapp.com;",
          },
        ],
      },
      // Manifest.json specific headers
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  // Next.js automatically exposes NEXT_PUBLIC_* variables to the browser
  // No need to explicitly define them in the env section
  // Performance optimizations
  experimental: {
    optimizeCss: false, // Disabled due to critters module issue
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
  // Bundle analyzer for production builds
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),
  webpack: (config, { isServer }) => {
    // Only apply fallbacks and externals on client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
      };
      
      // Exclude server-only modules from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'firebase-admin': 'firebase-admin',
      });
    }

    // Exclude undici from being processed by Next.js loaders
    config.module.rules.unshift({
      test: /node_modules\/undici/,
      type: 'javascript/auto',
      use: 'ignore-loader',
    });

    // Handle module resolution issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  transpilePackages: ['firebase', '@firebase/storage'],
}

module.exports = withNextIntl(withPWA(nextConfig))
