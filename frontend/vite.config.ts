import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Mirror the vercel.json rewrite so `npm run dev` talks to the live backend
      '/api': {
        target: 'http://pitchpulse-backend-env.eba-yhtgfwu8.us-east-1.elasticbeanstalk.com',
        changeOrigin: true,
      },
    },
  },
})
