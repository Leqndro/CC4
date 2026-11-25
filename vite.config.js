import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' faz o site funcionar em qualquer endereço (ex.: GitHub Pages),
// sem precisar saber o nome do repositório.
export default defineConfig({ base: './', plugins: [react()] })
