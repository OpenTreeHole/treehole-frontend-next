import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import vuetify from 'vite-plugin-vuetify'
import visualizer from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ styles: { configFile: 'src/plugins/vuetify.scss' } }),
    visualizer({
      emitFile: true,
      filename: 'report.html'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
