<template>
    <v-tooltip z-index="1000" top>
        <template v-slot:activator="{ on: tt }">
            <v-chip v-on="tt" :class="color">
                <v-icon>{{ icon }}</v-icon>
            </v-chip>
        </template>
        <span>
            {{ message }}
        </span>
    </v-tooltip>
</template>
<script>
export default {
    props: {
        item: Object,
        required: true,
    },
    computed: {
        icon() {
            if (this.item.uploaded) {
                return "mdi-check-bold"
            } else {
                console.log("save alert", this.item)
                return "mdi-content-save-alert"
            }
        },
        color() {
            if (this.item.uploaded) {
                return "success"
            } else {
                return "error"
            }
        },
        message() {
            if (this.item.uploaded) {
                return "File was Uploaded or already existed"
            } else {
                return "Upload Failed"
            }
        },
    },
}
</script>
