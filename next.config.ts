import { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: 
                https://trustedimages.com 
                https://community.cloudflare.steamstatic.com 
                https://community.fastly.steamstatic.com 
                https://community.akamai.steamstatic.com;
              connect-src 'self';
              frame-ancestors 'self';
            `.replace(/\s{2,}/g, " "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "community.cloudflare.steamstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "community.fastly.steamstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "community.akamai.steamstatic.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
