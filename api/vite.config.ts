import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      adapter: 'fastify',
      appPath: './src/app.ts',
      tsCompiler: 'esbuild',
    }),
  ],
  build: {
    minify: 'terser',
  },
  server: {
    port: 4002,
  },
  optimizeDeps: {
    exclude: ['bcrypt'],
  },
})
