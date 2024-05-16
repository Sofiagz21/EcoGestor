/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // replace 'localhost' with your domain if you're loading images from an external source
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_HOST + "/api/:path*",
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;