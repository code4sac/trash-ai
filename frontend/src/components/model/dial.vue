<template>
    <v-speed-dial v-model="fab" :transition="transition" direction="bottom">
        <template v-slot:activator>
            <v-btn fab small class="primary my-2">
                <v-icon v-if="fab"> mdi-close </v-icon>
                <v-icon v-else> mdi-dots-vertical </v-icon>
            </v-btn>
        </template>
        <model-remove :item="item" />
        <model-download :item="item" />
        <model-meta :item="item" />
    </v-speed-dial>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            fab: false,
            transition: "slide-y-reverse-transition",
        }
    },
}
</script>
