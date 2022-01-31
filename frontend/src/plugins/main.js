import Vue from "vue";
const is_local = process.env.NODE_ENV === "local";
Vue.config.productionTip = is_local;
