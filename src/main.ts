import './assets/main.css'
import 'vue3-pdf-app/dist/icons/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import VuePdfApp from 'vue3-pdf-app'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('VuePdfApp', VuePdfApp)

app.mount('#app')
const themeStore = useThemeStore()
if (themeStore.dark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
