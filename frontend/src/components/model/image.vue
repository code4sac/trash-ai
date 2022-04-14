<template>
    <meta-busy v-if="$fetchState.pending" />
    <inner-image-zoom
        v-else
        :src="dataUrl"
        :width="item.width > page_width ? page_width : item.width"
    />
</template>
<script>
import { db } from "@/lib/libstore"

import InnerImageZoom from 'vue-inner-image-zoom'

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    components: {
        InnerImageZoom,
    },
    data() {
        return {
            dataUrl: "",
            page_width: 0,
        }
    },
    async fetch() {
        const dat = await db.trash.get(this.item.hash)
        this.dataUrl = dat.processedDataUrl || dat.dataUrl
        this.page_width = this.$parent.$el.scrollWidth
    },
}
</script>
