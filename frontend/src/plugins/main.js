import Vue from "vue";
import 'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'
const is_local = process.env.NODE_ENV === "local";
Vue.config.productionTip = is_local;
