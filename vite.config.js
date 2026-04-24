import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to the repository name for GitHub Pages subdirectory deployment
  base: '/Anonymous-Rights-Protector/',
  build: {
    outDir: 'dist',
  }
})
