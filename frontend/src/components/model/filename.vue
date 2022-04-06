<template>
    <v-chip class="success">
        <slot />
        {{ filename }}
    </v-chip>
</template>
<script>
export default {
    props: {
        item: Object,
        required: true,
    },
    computed: {
        filename() {
            // truncate
            if (this.is_mobile) {
                return this.item.filename.substring(0, 10) + "..."
            }
            return this.item.filename
        },
    },
}
</script>
