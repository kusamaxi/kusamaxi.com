import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import UnocssPlugin from '@unocss/vite'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [
    mdx({
      jsx: true,
      jsxImportSource: 'solid-js'
    }),
    solidPlugin(),
    UnocssPlugin()
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  }
})
