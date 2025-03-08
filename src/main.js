import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import "bootstrap"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import "sweetalert2/dist/sweetalert2.min.css"
import "@fortawesome/fontawesome-free/css/all.css"

// Crea la aplicación Vue e instala Pinia antes de otros plugins
const app = createApp(App)

// Instalar Pinia
app.use(createPinia())
// Instalar el router
app.use(router)
// Montar la app
app.mount('#app')
