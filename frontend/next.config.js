/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wise.com',
        pathname: '/public-resources/assets/flags/rectangle/**',
      },
    ],
  },
};

module.exports = nextConfig;
