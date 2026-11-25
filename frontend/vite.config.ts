import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Durante o desenvolvimento, os pedidos para /chamados vão para a API (porta 3333).
    // Assim o salão e a cozinha parecem estar no mesmo endereço.
    proxy: {
      '/chamados': 'http://localhost:3333',
    },
  },
})
