<template>
    <v-banner class="mb-5">
        <v-card class="pa-0">
            <v-card-text class="pa-0">
                <v-btn
                    v-if="$nuxt.context.from"
                    icon
                    :to="$nuxt.context.from.path"
                    class="ml-5 mt-3"
                >
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-btn
                    icon
                    @click="refresh_route"
                    class="float-right mr-5 mt-2"
                >
                    <v-icon>mdi-refresh</v-icon>
                </v-btn>
            </v-card-text>
            <v-card-title class="pt-0">
                <v-spacer />
                <h2 class="text-truncate">{{ ctitle }}</h2>
                <v-spacer />
            </v-card-title>
        </v-card>
    </v-banner>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
    },
    computed: {
        ctitle() {
            if (this.title) {
                return this.title;
            }
            return this.page_title
        },
    },
}
</script>
<style scoped>
.v-banner >>> .v-banner__wrapper {
    padding: 0px;
}
</style>
