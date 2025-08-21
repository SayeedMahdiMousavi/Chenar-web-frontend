/** @type {import('next-sitemap').IConfig} */
// eslint-disable-next-line no-undef
export const siteUrl = process.env.APP_URL_PROD || 'https://staging.learninbox.com';
export const generateRobotsTxt = true;
export const outDir = './out';
export const robotsTxtOptions = {
    policies: [{ userAgent: '*', allow: '/' }],
};
  