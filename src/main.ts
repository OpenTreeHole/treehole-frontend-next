import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import { router } from './router'
import { vuetify } from './plugins/vuetify'
import './index.scss'

const pinia = createPinia()

createApp(App).use(router).use(vuetify).use(pinia).mount('#app')
