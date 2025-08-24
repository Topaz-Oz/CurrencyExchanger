/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for localhost
  images: {
    unoptimized: true,
  },
  // Disable telemetry
  telemetry: false,
  // Enable strict mode for better development
  reactStrictMode: true,
};

module.exports = nextConfig;
