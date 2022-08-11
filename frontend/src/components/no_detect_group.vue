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
import * as m from '@/lib'
import { toInteger } from 'lodash'

interface State {
    displays: m.Display[]
}

export default defineComponent({
    name: 'NoDetectGroup',
    data(): State {
        return {
            displays: [],
        }
    },
    setup() {
        const appstore = m.useAppStore()
        const imgstore = m.useImageStore()
        return {
            appstore,
            imgstore,
        }
    },
    async mounted() {
        this.displays = await m.imagedb.savedata
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
