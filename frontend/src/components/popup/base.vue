<template>
    <v-dialog
        v-model="active"
        transition="dialog-bottom-transition"
        :max-width="width"
    >
        <v-card :min-width="cwidth">
            <v-card-title>
                <slot name="header-left" />
                <v-spacer />
                {{ title }}
                <v-spacer />
                <slot name="header-right" />
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <slot />
            </v-card-text>
            <v-card-actions>
                <slot name="actions" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        kid: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            default: "500",
        },
    },
    data() {
        return {
            active: false,
            title: "",
        }
    },
    computed: {
        cwidth() {
            return this.is_mobile ? "100%" : this.width
        },
    },
    created() {
        this.$nuxt.$on("open" + this.kid, (title) => {
            if (title) {
                this.title = title
            }
            this.active = true
        })
        this.$nuxt.$on("close" + this.kid, () => {
            this.active = false
        })
    },
    methods: {
        close() {
            this.active = false
        },
    },
}
</script>
