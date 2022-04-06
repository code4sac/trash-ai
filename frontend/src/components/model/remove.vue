<template>
    <meta-busy v-if="$fetchState.pending" />
    <span v-else>
        <v-tooltip z-index="1000" top>
            <template v-slot:activator="{ on: tt }">
                <v-btn
                    fab
                    small
                    v-on="tt"
                    class="error"
                    @click="doremove(item)"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
            <span> Remove from list </span>
        </v-tooltip>
    </span>
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
