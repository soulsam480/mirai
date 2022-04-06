/* eslint-disable */
const { withSuperjson } = require('next-superjson')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['@mirai/api'], { debug: true })

module.exports = withPlugins([withSuperjson, withTM], {
  reactStrictMode: true,
  webpack(config) {
    // if (!isServer) {
    //   config.node = {
    //     fs: 'empty',
    //   };
    // }

    // to avoid bcrypt being transpiled by webpack
    config.externals = [...config.externals, 'bcrypt']

    config.plugins.push(
      require('unplugin-auto-import/webpack')({
        resolvers: [
          require('unplugin-icons/resolver')({
            prefix: 'Icon',
            extension: 'jsx',
          }),
        ],
        eslintrc: {
          enabled: true,
          filepath: '../.eslintrc-auto-import.json',
        },
      }),
    )

    config.plugins.push(
      require('unplugin-icons/webpack')({
        compiler: 'jsx',
        jsx: 'react',
        autoInstall: true,
        prefix: 'icon',
        extension: 'jsx',
      }),
    )

    return config
  },
  distDir: 'dist',
})
