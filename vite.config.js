import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Since the dashboard is at the root of the repository/domain, base should be '/'
  base: '/',
  build: {
    outDir: 'dist',
  }
})
