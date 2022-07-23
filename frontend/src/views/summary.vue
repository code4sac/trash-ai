<template>
    <Busy v-if="summary == null" />
    <div v-else>
        <v-row align="center">
            <v-col
                align="center"
                justify="center"
            >
                <v-tabs
                    v-model="selected"
                    dark
                    grow
                    direction="vertical"
                >
                    <v-tab
                        value="detections"
                        :class="tclass('detections')"
                        v-if="summary.detected_objects.length > 0"
                        @click="
                            $router.push({
                                name: 'summary',
                                params: { tab: 'detections' },
                            })
                        "
                    >
                        <v-icon start>
                            mdi-file-document-multiple-outline
                        </v-icon>
                        Detections
                    </v-tab>
                    <v-tab
                        value="nodetections"
                        :class="tclass('nodetections')"
                        v-if="summary.no_detection_hashes.length > 0"
                        @click="
                            $router.push({
                                name: 'summary',
                                params: { tab: 'nodetections' },
                            })
                        "
                    >
                        <v-icon start> mdi-alert-octagram </v-icon>
                        No Detections
                    </v-tab>
                    <v-tab
                        value="maps"
                        :class="tclass('maps')"
                        v-if="summary.gps.list.length > 0"
                        @click="
                            $router.push({
                                name: 'summary',
                                params: { tab: 'maps' },
                            })
                        "
                    >
                        <v-icon start> mdi-map </v-icon>
                        Map Summary
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
        <v-card height="100vh">
            <v-window v-model="selected">
                <v-window-item
                    value="nodetections"
                    v-if="summary.no_detection_hashes.length > 0"
                >
                    <h1 class="mb-5 text-center">No Detections</h1>
                    <NoDetectGroup />
                </v-window-item>
                <v-window-item
                    value="detections"
                    v-if="summary.detected_objects.length > 0"
                >
                    <div class="border">
                        <h1 class="mb-5 text-center">Detections</h1>
                        <v-row
                            class="mx-5"
                            v-for="(det, idx) in detections"
                            :key="'det' + idx"
                        >
                            <v-col>
                                <router-link
                                    style="color: inherit"
                                    :to="{
                                        name: 'detection',
                                        params: { name: det.name },
                                    }"
                                >
                                    <b>
                                        {{ det.name }}
                                    </b>
                                </router-link>
                            </v-col>
                            <v-col>
                                <v-chip>
                                    {{ det.count }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </div>
                </v-window-item>
                <v-window-item
                    value="maps"
                    v-if="summary.gps.list.length > 0"
                >
                    <v-row>
                        <v-col
                            align="center"
                            justify="center"
                        >
                            <GMapSummary />
                        </v-col>
                    </v-row>
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'

interface Data {
    summary: m.Summary | null
    selected: string | null
}

interface Rank {
    name: string
    count: number
}

export default defineComponent({
    data(): Data {
        return {
            summary: null,
            selected: null,
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
    computed: {
        detections(): Rank[] | null {
            let sum: m.Summary | null = null
            sum = this.summary
            if (sum == null) {
                return null
            }
            return sum.page_list()
        },
    },
    async mounted() {
        console.log('summary this', this)
        this.summary = this.store.summary
        // @ts-ignore
        this.selected = this.$route.params.tab
    },
    watch: {
        selected: {
            handler(val: string | null) {
                if (val != null) {
                    this.$router.push({
                        name: 'summary',
                        params: { tab: val },
                    })
                }
            },
            immediate: true,
        },
    },
    methods: {
        async navdetection(idx: number) {
            const det_name = this.detections![idx].name
            await this.$router.push({
                name: 'detection',
                params: {
                    idx: idx,
                    name: det_name,
                },
            })
        },
        tclass(tab: string) {
            return this.$route.params.tab == tab ? 'thightlight' : 'tbg'
        },
    },
})
</script>
