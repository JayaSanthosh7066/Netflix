/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["my-netflix-videos.s3.ap-south-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
