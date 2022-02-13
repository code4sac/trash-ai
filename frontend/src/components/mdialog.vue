<template>
    <v-dialog
        scrollable
        :fullscreen="fullscreen"
        v-model="show"
        v-bind="$attrs"
    >
        <v-card :height="height">
            <v-card-title class="primary">
                <slot name="header_prefix" />
                <v-spacer v-if="$slots.header_prefix && !is_mobile" />
                {{ title }}
                <v-spacer v-if="!is_mobile" />
                <slot name="header_suffix" />
                <v-spacer />
                <v-btn icon @click="do_cancel">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text :style="`height: ${height}`">
                <slot />
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn v-if="cancel" text @click="do_cancel">
                    {{ cancel_text }}</v-btn
                >
                <v-btn v-if="agree" class="error" text @click="do_agree">
                    {{ agree_text }}</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        height: {
            type: String,
            default: "500px",
        },
        fullscreen: {
            type: Boolean,
            default: false,
        },
        cancel: {
            type: Boolean,
            default: false,
        },
        agree: {
            type: Boolean,
            default: false,
        },
        cancel_text: {
            type: String,
            default: "Cancel",
        },
        agree_text: {
            type: String,
            default: "Confirm",
        },
    },
    data() {
        return {
            dialog: false,
            resolve: null,
            reject: null,
            callback: null,
            title: "",
        }
    },
    computed: {
        show: {
            get() {
                return this.dialog
            },
            set(val) {
                if (val === false) {
                    this.do_cancel()
                }
            },
        },
    },
    methods: {
        open(title) {
            this.dialog = true
            this.title = title
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        do_agree() {
            this.resolve(true)
            this.dialog = false
        },
        do_cancel() {
            this.resolve(false)
            this.dialog = false
        },
    },
}
</script>
