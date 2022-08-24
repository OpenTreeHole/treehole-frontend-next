import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import VuetifyPlugin from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VuetifyPlugin({ styles: 'expose' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
