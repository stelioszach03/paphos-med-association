/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      '@node-rs/argon2': '@node-rs/argon2',
      '@node-rs/argon2-darwin-arm64': '@node-rs/argon2-darwin-arm64',
      '@node-rs/bcrypt': '@node-rs/bcrypt',
      '@node-rs/bcrypt-darwin-arm64': '@node-rs/bcrypt-darwin-arm64'
    });
    return config;
  },
  async headers() {
    const csp = `default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';`
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ]
  }
};

export default nextConfig;
