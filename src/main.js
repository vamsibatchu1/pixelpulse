import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'

// PrimeVue styles
import 'primevue/resources/themes/saga-blue/theme.css' //theme
import 'primevue/resources/primevue.min.css' //core css
import 'primeicons/primeicons.css' //icons
import './assets/fonts.css' //custom fonts

const app = createApp(App)
app.use(PrimeVue)
app.mount('#app')
