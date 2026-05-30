/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  ...(isGitHubPages ? { basePath: '/travel-ranger-japan' } : {}),
};

module.exports = nextConfig;
