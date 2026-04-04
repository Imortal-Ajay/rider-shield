/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for ethers.js v6 in Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
