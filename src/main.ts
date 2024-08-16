import 'primeflex/primeflex.css';
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import 'primeicons/primeicons.css';
import './styles.css';


import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Lara,
    },
    options: {
        prefix: 'p',
    }
});
app.mount("#app");
