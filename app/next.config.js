/* eslint-disable */
const { withSuperjson } = require('next-superjson')
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['@mirai/api'], { debug: true })
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        // autoInstall: true,
        prefix: 'icon',
        extension: 'jsx',
      }),
    )

    // config.plugins.push(new ForkTsCheckerWebpackPlugin())

    return config
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  distDir: 'dist',
}

module.exports = withPlugins([withSuperjson, withTM], nextConfig)
