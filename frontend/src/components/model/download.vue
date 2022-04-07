<template>
    <span>
        <v-tooltip z-index="1000" top>
            <template v-slot:activator="{ on: tt }">
                <span v-on="tt">
                    <v-btn @click="download" class="success" fab small>
                        <v-icon>mdi-file-download</v-icon>
                    </v-btn>
                </span>
            </template>
            <span> Download Full Size Image </span>
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
    methods: {
        async download() {
            const dat = await db.trash.get(this.item.hash)
            const image = dat.processedDataUrl.replace(
                "image/png",
                "image/octet-stream"
            )
            var link = document.createElement("a")
            link.download = `${this.item.hash}.png`
            link.href = image
            link.click()
        },
    },
}
</script>
