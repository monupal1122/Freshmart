import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< HEAD
=======
  preview: {
    host: true, // allow external host
    allowedHosts: ['freshmart-6whw.onrender.com']
  }
>>>>>>> 00a446d2f1bf77bef900972ecbaa0a42b9b56acc
})
