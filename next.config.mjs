/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['groq-sdk'],
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
