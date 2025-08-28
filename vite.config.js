import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/clickfood/',
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@order': path.resolve(__dirname, 'src/features/order'),
      '@menu': path.resolve(__dirname, 'src/features/menu'),
      '@partner': path.resolve(__dirname, 'src/features/partner'),
    },
  },
})
