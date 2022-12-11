import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { md } from 'vuetify/iconsets/md'
import { createVuetify } from 'vuetify'

export const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      md
    }
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#f5f5f5',
          surface: '#ffffff'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#1b1b1b',
          surface: '#191b1c'
        }
      }
    }
  }
})
