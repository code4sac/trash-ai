<template>
    <v-tooltip z-index="1000" top>
        <template v-slot:activator="{ on }">
            <v-btn
                :icon="icon"
                v-bind="$attrs"
                @click="$nuxt.$emit('reload_page')"
                v-on="on"
                class="mx-5"
            >
                <slot>
                    <v-icon>mdi-refresh</v-icon>
                </slot>
            </v-btn>
        </template>
        <span>Refresh Application</span>
    </v-tooltip>
</template>
<script>
export default {
    props: {
        icon: {
            type: Boolean,
            default: true,
        },
    },
}
</script>
