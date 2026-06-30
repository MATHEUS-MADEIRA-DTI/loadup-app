/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    // Prevents webpack from trying to bundle Node.js-only packages used in
    // the /api/share route (puppeteer-core and the Sparticuz chromium binary).
    serverComponentsExternalPackages: [
      "puppeteer-core",
      "@sparticuz/chromium-min",
    ],
  },
};

module.exports = nextConfig;
