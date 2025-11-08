/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ This tells Next.js to completely skip ESLint checks during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
