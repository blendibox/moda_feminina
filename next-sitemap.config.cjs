/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:  'https://modafeminina.blendibox.com.br',
  generateRobotsTxt: false,
  sitemapSize: 5000,
   exclude: [
	  "/404",
	  "/*/__dummy__"
	],
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", disallow: ["/404"] },
      { userAgent: "*", allow: "/" },
    ]
  },
}