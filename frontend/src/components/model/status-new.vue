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
            if (this.item.exists) {
                return "mdi-file-star"
            } else {
                return "mdi-new-box"
            }
        },
        color() {
            if (this.item.exists) {
                return "warning"
            } else {
                return "success"
            }
        },
        message() {
            if (this.item.exists) {
                return "File already exists in the store"
            } else {
                return "New Upload! thank you for sharing :)"
            }
        },
    },
}
</script>
