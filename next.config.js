// Next.js automatically loads .env.local - no need for manual dotenv loading

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disabled in dev, enabled in production
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
