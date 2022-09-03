import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true
    }),
    vuetify({
      styles: 'expose'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
