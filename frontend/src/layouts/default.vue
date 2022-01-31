<template>
    <nav-base>
        <v-card id="navin" v-if="is_mobile">
            <sections-global />
            <Nuxt v-bind="nuxt_props" />
        </v-card>
        <v-row align="center" v-else>
            <v-col :cols="col_margin"> &nbsp; </v-col>
            <v-col id="navin" :cols="mid_margin">
                <sections-global />
                <Nuxt v-bind="nuxt_props" />
            </v-col>
            <v-col :cols="col_margin"> &nbsp; </v-col>
        </v-row>
    </nav-base>
</template>
<script>
export default {
    name: "Default",
    head: {
        title: "Welcome",
        titleTemplate: "%s - trash.ai",
    },
    computed: {
        nuxt_props() {
            if (!this.is_dev) {
                return {
                    "keep-alive": true,
                    "keep-alive-props": {
                        max: 10,
                    },
                }
            }
            return {}
        },
        mid_margin() {
            if (this.is_mobile) {
                return "12"
            } else {
                return "10"
            }
        },
        col_margin() {
            if (this.is_mobile) {
                return "0"
            } else {
                return "1"
            }
        },
    },
}
</script>
