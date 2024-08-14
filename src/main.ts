//import 'primeflex/primeflex.css';
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';


import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Lara,
    },
    options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false
    }
});
app.mount("#app");
