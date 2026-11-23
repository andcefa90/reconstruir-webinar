import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // En GitHub Pages el sitio vive en /reconstruir-webinar/
  base: (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.GITHUB_PAGES ? '/reconstruir-webinar/' : '/',
  plugins: [react(), tailwindcss()],
})
