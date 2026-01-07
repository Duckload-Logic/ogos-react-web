import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5174,
    open: false,
  },
})