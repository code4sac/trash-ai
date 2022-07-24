<template>
    <v-tooltip
        z-index="1000"
        location="left"
    >
        <template v-slot:activator="tt">
            <v-icon
                class="mx-5"
                v-bind="tt.props"
                @click="download"
                size="25"
            >
                mdi-file-download
            </v-icon>
        </template>
        <span> Download Full Size Image </span>
    </v-tooltip>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'
export default defineComponent({
    name: 'Download',
    props: {
        sdata: {
            type: [m.SaveData],
            required: true,
        },
    },
    methods: {
        async download() {
            const image = this.sdata?.processeddataUrl?.replace(
                'image/png',
                'image/octet-stream',
            )
            const link = document.createElement('a')
            link.download = `${this.sdata.hash}.png`
            link.href = image || '#'
            link.click()
        },
    },
})
</script>
