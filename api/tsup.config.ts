import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  sourcemap: false,
  clean: true,
  target: 'node16',
  minify: false,
  bundle: true,
  noExternal: ['@mirai/app'],
  skipNodeModulesBundle: true,
})
