<template>
    <v-tooltip z-index="1000" top>
        <template v-slot:activator="{ on: tt }">
            <v-chip v-on="tt" class="success">
                <slot />
                {{ filename }}
            </v-chip>
        </template>
        <span> SHA256 Hash: {{ item.hash }} </span>
    </v-tooltip>
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
