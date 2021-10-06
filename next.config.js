// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");
const withMDX = require("@next/mdx")({
  extension: /\.mdx$/,
});

const moduleExports = withMDX({
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: "/invite",
        destination:
          "https://discord.com/api/oauth2/authorize?client_id=735395698278924359&permissions=537250880&scope=bot%20applications.commands",
        permanent: false,
      },
      {
        source: "/login",
        destination: "https://auth--message.anothercat.me/auth/login",
        permanent: false,
      },
      {
        source: "/logout",
        destination: "https://auth--message.anothercat.me/auth/logout",
        permanent: false,
      },
    ];
  },
  images: {
    domains: ["cdn.discordapp.com"],
  },
});

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
//module.exports = moduleExports;
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
