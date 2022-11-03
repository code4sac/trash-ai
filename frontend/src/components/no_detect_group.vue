<template>
    <Busy v-if="displays.length < 1" />
    <v-sheet>
        <div class="d-flex flex-wrap">
            <Thumb
                v-for="(img, idx) in displays"
                @click="doroute(img.hash)"
                :key="idx"
                :item="img"
            />
        </div>
    </v-sheet>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { toInteger } from 'lodash'
import { Display } from '@/lib/models'
import { useImageStore, useAppStore } from '@/lib/store'
import { imagedb } from '@/lib/imagedb'

interface State {
    displays: Display[]
}

export default defineComponent({
    name: 'NoDetectGroup',
    data(): State {
        return {
            displays: [],
        }
    },
    setup() {
        const appstore = useAppStore()
        const imgstore = useImageStore()
        return {
            appstore,
            imgstore,
        }
    },
    async mounted() {
        this.displays = await imagedb.savedata
            .bulkGet(this.imgstore.summary.no_detection_hashes)
            .then((res) => res.map((x) => x!.display))
    },
    methods: {
        async doroute(hash_id: string) {
            const idx = this.imgstore.hash_ids.indexOf(hash_id)
            this.$router.push({
                name: 'image',
                params: { idx: toInteger(idx), tab: 'image' },
            })
        },
    },
})
</script>
