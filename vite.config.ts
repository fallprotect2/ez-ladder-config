import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ez-ladder-config/', // repo name
  plugins: [react()]
})
