/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix cross-origin warning
  allowedDevOrigins: ['192.168.56.1'],
  
  // Optional: Better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
