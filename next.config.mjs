/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['groq-sdk'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
