<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-img
        v-else
        :src="dataUrl"
        max-width="100"
        contain
        height="100"
        aspect-ratio="1"
    />
</template>
<script>

import { db } from "@/lib/libstore"

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dataUrl: '',
        };
    },
    async fetch() {
        const dat = await db.trash.get(this.item.hash)
        this.dataUrl = dat.processedDataUrl || dat.dataUrl
    },
}
</script>
