<template>
    <Busy v-if="summary == null" />
    <v-sheet>
        <v-row align="center">
            <v-col
                align="center"
                justify="center"
            >
                <v-pagination
                    v-model="vpage"
                    :length="summary?.detected_objects.length"
                    :total-visible="is_mobile ? 3 : 7"
                    circle
                    variant="elevated"
                />
            </v-col>
        </v-row>
        <h1 class="text-center">
            {{ obj?.name }}
            <v-chip
                class="mx-5"
                color="green"
                size="12"
            >
                {{ obj?.count }}
            </v-chip>
        </h1>
        <div
            class="d-flex flex-wrap my-5"
            v-if="displays.length > 0"
        >
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
    summary: m.Summary | null
    obj: m.TrashObject | null
    displays: m.Display[]
    selected_name: string
    selected_idx: number | null
}

export default defineComponent({
    data(): State {
        return {
            selected_name: '',
            selected_idx: null,
            summary: null,
            obj: null,
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
    watch: {
        selected_idx: {
            async handler(idx: number | null) {
                if (idx != null) {
                    const name = this.summary?.detected_objects[idx].name
                    if (name != null) {
                        await this.setupObjects(name)
                    }
                }
            },
            deep: true,
        },
        selected_name: {
            async handler(val: string | null) {
                if (val != null) {
                    await this.$router.push({
                        name: 'detection',
                        params: {
                            name: val,
                        },
                    })
                    await this.setupObjects(val)
                }
            },
            deep: true,
        },
        'imgstore.hash_ids': {
            async handler(val: string[]) {
                if (val.length === 0) {
                    this.$router.push({
                        name: 'uploads',
                        params: {
                            idx: 0,
                        },
                    })
                }
            },
            deep: true,
        },
    },
    computed: {
        vpage: {
            get() {
                return this.selected_idx! + 1
            },
            async set(v: number) {
                m.log.debug('set', v, this.selected_idx)
                this.selected_idx = toInteger(v) - 1
            },
        },
        is_mobile(): boolean {
            return this.$vuetify.display.mobile
        },
    },
    async mounted() {
        this.summary = this.imgstore.summary
        // @ts-ignore
        await this.setupObjects(this.$route.params.name)
    },
    methods: {
        async doroute(hash_id: string) {
            const idx = this.imgstore.hash_ids.indexOf(hash_id)
            this.$router.push({
                name: 'image',
                params: { idx: toInteger(idx), tab: 'image' },
            })
        },
        async setupObjects(name: string | null) {
            const sum: m.Summary = this.summary!
            this.selected_name = name!
            const idx = sum.detected_objects.findIndex(
                (obj) => obj.name === name,
            )
            if (idx < 0) {
                this.obj = null
                this.displays = []
                return
            }
            this.selected_idx = idx
            this.obj = sum.detection_by_name(this.selected_name) ?? null
            const tmp = await m.imagedb.savedata.bulkGet(this.obj!.hashes)
            this.displays = tmp?.map((x) => x!.display)
            m.log.debug('detection mounted', this.displays)
            this.appstore.setTitle(
                `Detections: ${this.obj?.name} (${this.obj?.count})`,
            )
        },
    },
})
</script>
