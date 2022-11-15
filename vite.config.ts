import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// resolve.mainFields is a workaround for:
//  https://github.com/vitejs/vite/issues/7376

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    mainFields: [],
  },
  server: {
    port: 32080
  }
})
