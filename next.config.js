/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
    ],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://3arida.ma',
  },
  webpack: (config, { isServer }) => {
    // Fix for undici compatibility issue
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
      
      // Exclude problematic modules from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'undici': 'undici',
        'firebase-admin': 'firebase-admin',
      });
    }

    // Completely exclude undici from webpack processing
    config.module.rules.push({
      test: /node_modules\/undici/,
      use: 'null-loader',
    });

    // Handle module resolution issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Ignore undici and related warnings
    config.ignoreWarnings = [
      { module: /node_modules\/undici/ },
      { file: /node_modules\/undici/ },
      { message: /Module parse failed.*undici/ },
    ];

    // Add alias to prevent undici from being bundled
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
    };
    
    return config;
  },
  transpilePackages: ['firebase'],
}

module.exports = nextConfig