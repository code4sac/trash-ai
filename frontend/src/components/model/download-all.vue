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
import { log } from '@/lib/logging'
import { useImageStore } from '@/lib/store'

export default defineComponent({
    name: 'DownloadAll',
    setup() {
        const store = useImageStore()
        return {
            store,
        }
    },
    mounted() {
        log.debug('mounted', this)
    },
})
</script>
