/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Sanity serves all art assets from its CDN. Next/image optimizes them
    // into responsive AVIF/WebP with lazy loading + blur placeholders.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
