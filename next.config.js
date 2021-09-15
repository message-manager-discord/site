/** @type {import('next').NextConfig} */

const withMDX = require("@next/mdx")({
  extension: /\.mdx$/,
});

module.exports = withMDX({
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: 'https://github.com/message-manager-discord/bot/blob/master/PRIVACY_POLICY.md',
        permanent: true,
      },
      {
        source: '/invite',
        destination: 'https://discord.com/api/oauth2/authorize?client_id=735395698278924359&permissions=537250880&scope=bot%20applications.commands',
        permanent: true,
      },
    ]
  },
});
