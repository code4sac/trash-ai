import Vue from "vue"

var GlobalMixin = {
    computed: {
        is_dev() {
            return this.$root.context.isDev
        },
        is_mobile() {
            return this.$vuetify.breakpoint.mobile
        },
        page_title: {
            get() {
                return this.$store.state.title.value
            },
            set(value) {
                console.log("set page_title", value)
                this.$store.commit("title/set", value)
            },
        },
        api_url() {
            return this.$root.context.env.BACKEND_URL
        },
        dark_mode: {
            get() {
                let val = this.$store.state.web_settings.dark_mode
                this.$vuetify.theme.dark = val
                return val
            },
            set(value) {
                this.$store.dispatch("web_settings/set_dark_mode", value)
                this.$vuetify.theme.dark = value
            },
        },
    },
    methods: {
        async get_ref(ref_id) {
            while (!this.$refs[ref_id]) {
                await new Promise((resolve) => setTimeout(resolve, 100))
            }
            return this.$refs[ref_id]
        },
    },
}

Vue.mixin(GlobalMixin)
