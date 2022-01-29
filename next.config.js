/* eslint-disable */

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(
      require('unplugin-auto-import/webpack')({
        resolvers: [
          require('unplugin-icons/resolver')({
            prefix: 'Icon',
            extension: 'jsx',
          }),
        ],
      }),
    );

    config.plugins.push(
      require('unplugin-icons/webpack')({
        compiler: 'jsx',
        jsx: 'react',
        autoInstall: true,
        prefix: 'icon',
        extension: 'jsx',
      }),
    );

    return config;
  },
};
