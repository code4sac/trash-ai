<template>
    <Busy v-if="!loaded" />
    <div v-else>
        <v-row align="center">
            <v-col
                align="center"
                justify="center"
            >
                <v-pagination
                    v-if="store.hash_ids.length > 0"
                    v-model="vpage"
                    :length="store.hash_ids.length"
                    :total-visible="is_mobile ? 3 : 7"
                    circle
                    variant="elevated"
                    center-active
                    centered
                    :show-arrows="is_mobile"
                />
                <v-tabs
                    v-model="selected_tab"
                    dark
                    grow
                >
                    <v-tab
                        value="image"
                        :class="tclass('image')"
                    >
                        <v-icon start> mdi-image </v-icon>
                        <span v-if="!is_mobile"> Image </span>
                    </v-tab>
                    <v-tab
                        value="meta"
                        v-if="meta_has.meta"
                        :class="tclass('meta')"
                    >
                        <v-icon start> mdi-code-json </v-icon>
                        <span v-if="!is_mobile"> Metadata </span>
                    </v-tab>
                    <v-tab
                        value="map"
                        v-if="display?.gps != null"
                        :class="tclass('map')"
                    >
                        <v-icon start> mdi-map </v-icon>
                        <span v-if="!is_mobile"> Map </span>
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col>
                <div class="d-flex">
                    <v-spacer />
                    <h2 class="d-inline">
                        <Download
                            v-if="sdata != null"
                            :sdata="sdata"
                        />
                        {{ sdata?.filename }} ({{ x_of_y }})
                    </h2>
                    <span class="ma-2" />
                    <DetectedObjectsSummary
                        class="d-inline"
                        :sdata="sdata"
                        v-if="sdata"
                    />
                    <v-spacer />
                    <div class="align-content-end">
                        <Thumb
                            :item="sdata"
                            v-if="selected_tab != 'image' && sdata != null"
                        />
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-card>
            <v-window v-model="selected_tab">
                <v-window-item value="image">
                    <v-row>
                        <v-col
                            align="center"
                            justify="center"
                            v-if="sdata != null"
                        >
                            <Classify
                                :sdata="sdata"
                                v-if="sdata"
                            />
                        </v-col>
                    </v-row>
                </v-window-item>
                <v-window-item
                    value="meta"
                    v-if="meta_has.meta"
                >
                    <v-container>
                        <v-row v-if="meta_has.exif">
                            <v-col>
                                <h2>Exif Data</h2>
                                <CopyButton :text="sdata?.prettyExif ?? ''" />
                            </v-col>
                            <v-col>
                                <pre>{{ sdata?.prettyExif }}</pre>
                            </v-col>
                        </v-row>
                        <v-row v-if="meta_has.tfmeta">
                            <v-col>
                                <h2>Metadata</h2>
                                <CopyButton :text="sdata?.prettyTFMeta ?? ''" />
                            </v-col>
                            <v-col>
                                <pre>{{ sdata?.prettyTFMeta }}</pre>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-window-item>
                <v-window-item
                    value="map"
                    v-if="display.gps != null"
                >
                    <v-row align="center">
                        <v-col
                            align="center"
                            justify="center"
                        >
                            <GMap
                                v-if="display.gps != null"
                                :gps="display.gps"
                            />
                        </v-col>
                    </v-row>
                </v-window-item>
            </v-window>
        </v-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { toInteger } from 'lodash'

import { SaveData, Display } from '@/lib/models'
import { useImageStore, useAppStore } from '@/lib/store'
import { imagedb } from '@/lib/imagedb'

interface Data {
    sdata: SaveData | null
    display: Display | null
    loaded: boolean
    selected_tab: string
    selected_idx: number
}

interface MetaOK {
    meta: boolean
    tfmeta: boolean
    exif: boolean
}

export default defineComponent({
    data(): Data {
        return {
            sdata: null,
            display: null,
            loaded: false,
            selected_tab: 'image',
            selected_idx: 0,
        }
    },
    setup() {
        const store = useImageStore()
        const appstore = useAppStore()
        return {
            store,
            appstore,
        }
    },
    async mounted() {
        await this.setSdata()
    },
    watch: {
        selected_tab: {
            async handler(val: string | null) {
                if (val != null) {
                    await this.$router.push({
                        name: 'image',
                        params: {
                            tab: val,
                            idx: this.selected_idx,
                        },
                    })
                    this.setSdata()
                }
            },
            deep: true,
        },
        selected_idx: {
            async handler(idx: number | null) {
                if (idx != null) {
                    await this.$router.push({
                        name: 'image',
                        params: {
                            tab: this.selected_tab,
                            idx: idx,
                        },
                    })
                    this.setSdata()
                }
            },
            deep: true,
        },
    },
    computed: {
        ostyle() {
            return {
                left: `${this.appstore.highlight_image.x!}px`,
                top: `${this.appstore.highlight_image.y!}px`,
                position: 'sticky',
            }
        },
        vpage: {
            get() {
                return this.selected_idx + 1
            },
            set(newval: number) {
                this.selected_idx = newval - 1
            },
        },
        meta_has(): MetaOK {
            return {
                meta:
                    this.sdata?.prettyExif != '{}' ||
                    this.sdata?.prettyTFMeta != '[]',
                exif: this.sdata?.prettyExif != '{}',
                tfmeta: this.sdata?.prettyTFMeta != '[]',
            }
        },
        x_of_y() {
            return `${this.selected_idx + 1} of ${this.store.hash_ids.length}`
        },
        is_mobile(): boolean {
            return this.$vuetify.display.mobile
        },
    },
    methods: {
        async setSdata() {
            this.loaded = false
            // @ts-ignore
            this.selected_tab = this.$route.params.tab
            this.selected_idx = toInteger(this.$route.params.idx)
            const hid = this.store.hash_ids[this.selected_idx]
            this.sdata = (await imagedb.savedata.get(hid)) ?? null
            this.display = this.sdata!.display
            this.appstore.setTitle(`${this.sdata?.filename}`)
            this.loaded = true
        },
        tclass(tab: string) {
            return this.$route.params.tab == tab ? 'thightlight' : 'tbg'
        },
    },
})
</script>
