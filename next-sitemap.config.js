/** @type {import('next-sitemap').IConfig} */
const siteUrl =
  import.meta?.env?.VITE_SITE_URL || 'https://staging.learninbox.com';

export default {
  siteUrl,
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
