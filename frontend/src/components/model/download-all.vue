<template>
    <v-btn
        rounded
        color="success"
        @click="store.download_all"
    >
        <v-icon>mdi-folder-zip</v-icon>
        Download ALL ({{ store.hash_ids.length }})
    </v-btn>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'
export default defineComponent({
    name: 'DownloadAll',
    setup() {
        const store = m.useImageStore()
        return {
            store,
        }
    },
    mounted() {
        console.log('mounted', this)
    },
})
</script>
