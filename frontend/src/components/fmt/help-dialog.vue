<template>
    <v-dialog v-model="dialog" :width="width">
        <template v-slot:activator="{ on }">
            <v-btn x-small icon v-on="on">
                <v-icon size="16">mdi-help-circle</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="secondary">
                {{ title }}
            </v-card-title>
            <v-card-text class="pa-5">
                {{ text }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" text @click="dialog = false">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            default: "500px",
        },
    },
    data() {
        return {
            dialog: false,
        }
    },
    fetch() {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                resolve({ hello: "world" })
            }, 5000)
        })
    },
    methods: {
        open() {
            this.dialog = true
        },
    },
    computed: {
        //
    },
}
</script>
