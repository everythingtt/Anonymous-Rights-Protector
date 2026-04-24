import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to relative for deployment on main branch/subdirectory
  base: './',
  build: {
    outDir: 'dist',
  }
})
