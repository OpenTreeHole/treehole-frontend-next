import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import { router } from './router'
import { vuetify } from './plugins/vuetify'
import './index.scss'
import { useNotification } from './composables/notification'
import { version } from '../package.json'

const pinia = createPinia()

const app = createApp(App).use(router).use(vuetify).use(pinia)

app.config.errorHandler = (err) => {
  const not = useNotification()
  if (err instanceof Error) {
    not.error(err.message)
  }
  console.error(err)
}

app.mount('#app')

console.log(`OpenTreeHole Frontend v${version}`)
