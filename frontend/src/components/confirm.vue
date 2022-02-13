<template>
    <v-dialog v-model="show" v-bind="$attrs">
        <v-card min-width="300px">
            <v-card-title class="primary">
                {{ title }}
            </v-card-title>
            <v-card-text class="pa-3">
                <slot />
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="cancel"> Cancel </v-btn>
                <v-btn class="error" text @click="agree"> Confirm </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
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
                    this.cancel()
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
        agree() {
            this.resolve(true)
            this.dialog = false
        },
        cancel() {
            this.resolve(false)
            this.dialog = false
        },
    },
}
</script>
