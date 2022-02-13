<template>
    <v-app app>
        <v-main>
            <nav-app-top />
            <v-container :key="ref_key">
                <div id="main" :class="scroller_class()">
                    <v-row>
                        <v-btn
                            v-show="fab"
                            v-scroll="onScroll"
                            fab
                            class="primary"
                            @click="toTop"
                        >
                            <v-icon> mdi-arrow-up-thick </v-icon>
                        </v-btn>
                    </v-row>
                    <v-row>
                        <v-btn fab class="primary" @click="toBottom">
                            <v-icon> mdi-arrow-down-thick </v-icon>
                        </v-btn>
                    </v-row>
                </div>
                <slot />
            </v-container>
            <nav-app-footer />
        </v-main>
    </v-app>
</template>
<script>

export default {
    data() {
        return {
            fab: false,
            rid: "start",
        }
    },
    computed: {
        ref_key() {
            return this.rid + this.$vuetify.breakpoint.width
        },
    },
    methods: {
        onScroll(e) {
            if (typeof window === "undefined") return
            const top = window.pageYOffset || e.target.scrollTop || 0
            this.fab = top > 20
        },
        toTop() {
            this.$vuetify.goTo(0)
        },
        toBottom() {
            this.$vuetify.goTo(document.body.scrollHeight)
        },
        scroller_class() {
            if (this.is_mobile) {
                return "bottom-mobile"
            } else {
                return "bottom-right"
            }
        },
    },
}
</script>

<style scoped>
.bottom-mobile {
    position: fixed;
    left: 50px;
    bottom: 50px;
    z-index: 200;
}
.bottom-right {
    position: fixed;
    right: 50px;
    bottom: 50px;
    z-index: 200;
}
</style>
