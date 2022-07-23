<template>
    <div height="100vh">
        <v-row align="center">
            <v-col
                align="center"
                justify="center"
            >
                <v-pagination
                    v-if="store.hash_ids.length > 0"
                    v-model="vpage"
                    :length="store.nav_length"
                    :total-visible="is_mobile ? 3 : 7"
                    circle
                    variant="elevated"
                />
            </v-col>
        </v-row>
        <v-card
            variant="outlined"
            min-height="70vh"
        >
            <v-row
                align="center"
                justify="center"
            >
                <v-col
                    align="center"
                    justify="center"
                >
                    <DragDropTitle />
                    <Thumb
                        :item="store.current_save_data"
                        v-if="store.current_save_data != null"
                    />
                    <div class="d-flex flex-wrap">
                        <Thumb
                            v-for="(img, idx) in displays"
                            @click="doroute(img.hash)"
                            :key="idx"
                            :item="img"
                            class="mx-1"
                        />
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'
import { toInteger } from 'lodash'

interface State {
    displays: m.Display[]
    nav_idx: number
}

export default defineComponent({
    data(): State {
        return {
            displays: [],
            nav_idx: 0,
        }
    },
    setup() {
        const store = m.useImageStore()
        const appstore = m.useAppStore()
        return {
            store,
            appstore,
        }
    },
    watch: {
        nav_idx: {
            async handler(idx: number) {
                if (idx != null) {
                    this.$router.push({
                        name: 'uploads',
                        params: { idx: toInteger(idx) },
                    })
                    this.setDisplays(toInteger(idx))
                }
            },
        },
        'store.hash_ids': {
            async handler(ids: string[]) {
                this.appstore.setTitle(`Uploads (${ids.length})`)
                await this.setDisplays(this.nav_idx)
            },
            deep: true,
        },
        'store.busy': {
            async handler(isbusy: boolean) {
                if (isbusy) {
                    return
                }
                await this.setDisplays(this.nav_idx)
            },
            deep: true,
        },
    },
    computed: {
        vpage: {
            get() {
                return this.nav_idx + 1
            },
            set(newval: number) {
                this.nav_idx = newval - 1
            },
        },
        is_mobile(): boolean {
            return this.$vuetify.display.mobile
        },
    },
    methods: {
        scolor(obj: string | null) {
            if (obj == null) {
                return 'green'
            }
            return 'red'
        },
        async doroute(hash: string) {
            const idx = this.store.hash_ids.indexOf(hash)
            this.$router.push({
                name: 'image',
                params: {
                    idx: idx,
                    tab: 'image',
                },
            })
        },
        async setDisplays(idx: number) {
            /* if (this.store.busy) { */
            /*     return */
            /* } */
            const hids = this.store.nav_hash_ids(idx)
            m.log.debug('setDisplays', hids)
            const data = await m.imagedb.savedata.bulkGet(hids)
            this.displays = data.map((d) => d!.display)
        },
    },
    async mounted() {
        this.nav_idx = toInteger(this.$route.params.idx) || 0
        await this.setDisplays(this.nav_idx)
        this.appstore.setTitle(`Uploads (${this.store.hash_ids.length})`)
    },
})
</script>
