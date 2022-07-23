import { createApp } from 'vue'
import App from './App.vue'
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'
import '@/scss/_variables.scss'
import router from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { GlobalComponents } from '@/components'

loadFonts()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
    .use(router)
    .use(GlobalComponents)
    .use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyCHnqg9uMYsX8r9V_FjzL8YOnNqn97PwXc',
        },
    })
    .use(vuetify)
    .mount('#app')
