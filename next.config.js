// Next.js automatically loads .env.local - no need for manual dotenv loading

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disabled in dev, enabled in production
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Ensure manifest.json is served correctly
  async headers() {
    return [
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
    // Fix for undici compatibility issue - ONLY on client side
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
      
      // Exclude problematic modules from client bundle ONLY
      config.externals = config.externals || [];
      config.externals.push({
        'undici': 'undici',
        'firebase-admin': 'firebase-admin',
      });

      // Exclude undici from client-side bundle ONLY
      config.module.rules.push({
        test: /node_modules\/undici/,
        use: 'null-loader',
      });

      // Add alias to prevent undici from being bundled on CLIENT SIDE ONLY
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false,
      };
    }

    // Handle module resolution issues (both client and server)
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Ignore undici warnings (both client and server)
    config.ignoreWarnings = [
      { module: /node_modules\/undici/ },
      { file: /node_modules\/undici/ },
      { message: /Module parse failed.*undici/ },
    ];
    
    return config;
  },
  transpilePackages: ['firebase'],
}

module.exports = withPWA(nextConfig)