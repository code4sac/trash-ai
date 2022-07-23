<template>
    <v-card-title
        class="text-center"
        v-if="!store.upload_busy"
    >
        <span v-if="!$vuetify.display.mobile"> Drag and Drop Images Here </span>
        <v-spacer />
        <v-icon x-large>mdi-file-image-plus</v-icon>
    </v-card-title>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'
export default defineComponent({
    name: 'DragDropTitle',
    setup() {
        const store = m.useImageStore()
        return {
            store,
        }
    },
    computed: {
        test() {},
    },
})
</script>
