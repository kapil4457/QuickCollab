/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    bodySizeLimit: "10mb", // or any size you prefer
  },
};

module.exports = nextConfig;
