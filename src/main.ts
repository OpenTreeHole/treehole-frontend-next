import { createApp } from 'vue'
import App from './App.vue'

import { router } from './router'
import { vuetify } from './plugins/vuetify'
import './index.scss'
import { key, store } from '@/store'

createApp(App).use(router).use(vuetify).use(store, key).mount('#app')
