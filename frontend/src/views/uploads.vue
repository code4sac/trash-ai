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
                    total-visible="7"
                    circle
                    variant="elevated"
                />
            </v-col>
        </v-row>
        <v-card
            variant="outlined"
            height="70vh"
        >
            <DragDropTitle />
            <v-row
                class="border ma-5"
                v-if="store.current_save_data != null"
                align="center"
                justify="center"
            >
                <Thumb :item="store.current_save_data" />
            </v-row>
            <v-row
                class="border ma-5"
                v-if="displays.length > 0"
            >
                <v-col
                    align="center"
                    justify="center"
                >
                    <div class="d-flex flex-wrap">
                        <Thumb
                            v-for="(img, idx) in displays"
                            @click="doroute(idx)"
                            :key="idx"
                            :item="img"
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
    },
    methods: {
        scolor(obj: string | null) {
            if (obj == null) {
                return 'green'
            }
            return 'red'
        },
        async doroute(idx: number) {
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
            console.log('setDisplays', hids)
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
