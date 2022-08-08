<template>
    <v-card
        v-cloak
        id="droparea"
        ref="droparea"
        @drop.prevent="imgstore.doupload($event.dataTransfer?.files)"
        @dragover.prevent
    >
        <Snack ref="snack" />
        <HighlightImage />
        <v-layout>
            <v-app-bar
                color="primary"
                prominent
            >
                <v-app-bar-nav-icon
                    v-if="is_mobile"
                    variant="text"
                    @click.stop="drawer = !drawer"
                />

                <v-toolbar-title class="ml-5">
                    <v-icon class="mr-5"> mdi-delete-variant </v-icon>
                    {{ appstore.title }}
                </v-toolbar-title>
                <v-spacer />
                <h2
                    class="ml-2 pa-2"
                    v-if="!is_mobile"
                >
                    Trash AI
                </h2>
                <v-tooltip location="bottom">
                    <template v-slot:activator="tt">
                        <v-btn
                            icon
                            v-bind="tt.props"
                            href="https://codeforsacramento.org/"
                            target="_blank"
                        >
                            <icon-code-4-sac />
                        </v-btn>
                    </template>
                    <span>Code 4 Sac Homepage</span>
                </v-tooltip>
                <v-tooltip location="bottom">
                    <template v-slot:activator="tt">
                        <v-btn
                            icon
                            v-bind="tt.props"
                            href="https://github.com/code4sac/trash-ai"
                            target="_blank"
                        >
                            <v-icon>mdi-github</v-icon>
                        </v-btn>
                    </template>
                    <span>TrashAI Github Project</span>
                </v-tooltip>
                <v-menu auto>
                    <template v-slot:activator="menu">
                        <v-tooltip location="bottom">
                            <template v-slot:activator="tt">
                                <span v-bind="tt.props">
                                    <v-btn
                                        text
                                        v-bind="menu.props"
                                    >
                                        <v-icon>
                                            mdi-application-cog-outline
                                        </v-icon>
                                    </v-btn>
                                </span>
                            </template>
                            <span>Show Web Settings</span>
                        </v-tooltip>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-btn
                                @click="toggleTheme"
                                variant="outlined"
                            >
                                Toggle Dark/Light Mode
                                <v-icon size="20">
                                    mdi-theme-light-dark
                                </v-icon>
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-app-bar>
            <v-navigation-drawer
                v-model="display_drawer"
                bottom
            >
                <v-list>
                    <v-list-item
                        @click="$router.push({ name: 'about' })"
                        :active="isactive('about')"
                    >
                        <v-list-item-title>
                            <v-icon class="mr-4">mdi-information</v-icon>
                            <span>About</span>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                        @click="
                            $router.push({
                                name: 'uploads',
                                params: { idx: '0' },
                            })
                        "
                        :active="isactive('uploads')"
                    >
                        <v-list-item-title>
                            <v-icon class="mr-4">mdi-image</v-icon>
                            <span>Uploads</span>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                        @click="
                            $router.push({
                                name: 'summary',
                                params: { tab: 'detections' },
                            })
                        "
                        :active="isactive('summary')"
                    >
                        <v-list-item-title>
                            <v-icon class="mr-4">
                                mdi-book-open-variant
                            </v-icon>
                            <span>Summary</span>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-divider />
            </v-navigation-drawer>

            <v-main>
                <v-container class="pa-10">
                    <div class="mb-7">
                        <Progress
                            :progress="imgstore.upload"
                            v-if="imgstore.is_processing"
                        />
                        <Progress
                            :progress="imgstore.process"
                            v-if="imgstore.is_processing"
                        />
                        <Progress
                            :progress="imgstore.zip"
                            v-if="imgstore.zip_busy"
                        />
                    </div>
                    <TrashSummary class="mb-5" />
                    <router-view />
                </v-container>
            </v-main>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
import Snack from '@/components/snack.vue'
import { defineComponent, ref } from 'vue'
import IconCode4Sac from '@/components/icon/code4sac.vue'
import HighlightImage from '@/components/model/highlight_image.vue'
import { useTheme } from 'vuetify'
import { useAppStore, useImageStore, useCache } from '@/lib/store'
import { log } from '@/lib/logging'
import { TensorFlow } from '@/lib'

interface Data {
    drawer: boolean
}

export default defineComponent({
    name: 'App',
    components: {
        IconCode4Sac,
        HighlightImage,
        Snack,
    },
    setup() {
        const imgstore = useImageStore()
        const appstore = useAppStore()
        const cache = useCache()
        const theme = useTheme()
        const snackbar = ref<typeof Snack>()
        return {
            cache,
            snackbar,
            imgstore,
            appstore,
            theme,
        }
    },
    async mounted() {
        // handle back button stuff
        window.onpopstate = () => {
            // @ts-ignore
            this.preloader = false
        }
        this.theme.global.name.value = this.appstore.theme
        this.imgstore.doinit()
        log.debug('veutify', this.$vuetify)
        log.debug('mounted', this)
        log.debug(navigator.storage.estimate())

        // this.$root!.$snack = this.snackbar!.value
    },
    data(): Data {
        return {
            drawer: false,
        }
    },
    async created() {
        await TensorFlow.getInstance().load()
    },
    computed: {
        is_mobile(): boolean {
            return this.$vuetify.display.mobile
        },
        display_drawer: {
            get() {
                return this.is_mobile ? this.drawer : true
            },
            set(val: boolean) {
                this.drawer = val
            },
        },
        img_cnt() {
            return this.imgstore.hash_ids.length
        },
    },
    methods: {
        isactive(name: string) {
            return this.$route.name === name
        },
        toggleTheme() {
            this.appstore.setTheme(
                this.appstore.theme == 'dark' ? 'light' : 'dark',
            )
            this.theme.global.name.value = this.appstore.theme
        },
    },
})
</script>
