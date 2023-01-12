<template>
    <div class="text-center">
        <input
            type="file"
            multiple
            ref="form"
            style="display: none"
            @input="doupload($event)"
        />
        <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
        >
            <template v-slot:activator="menu">
                <v-btn
                    color="primary"
                    v-bind="menu.props"
                    block
                >
                    <v-icon>mdi-menu</v-icon>
                    Actions
                </v-btn>
            </template>

            <v-card>
                <div
                    class="d-flex justify-space-between menu-btn-a"
                    @click="form.click()"
                >
                    <v-icon class="justify-start"> mdi-upload </v-icon>
                    <span class="justify-end">Upload</span>
                </div>
                <div
                    class="d-flex justify-space-between menu-btn-b"
                    v-if="!store.hash_ids.length > 0"
                    @click="store.do_sampleupload"
                >
                    <v-icon class="justify-start"> mdi-image-multiple </v-icon>
                    <span class="justify-end"> Show Samples </span>
                </div>
                <div
                    class="d-flex justify-space-between menu-btn-a"
                    v-if="store.hash_ids.length > 0"
                    @click="store.download_all"
                >
                    <v-icon class="justify-start"> mdi-folder-zip </v-icon>
                    <span class="justify-end">
                        Download ALL ({{ store.hash_ids.length }})
                    </span>
                </div>
                <div
                    class="d-flex justify-space-between menu-btn-d"
                    v-if="store.hash_ids.length > 0"
                    @click="store.clear"
                >
                    <v-icon class="justify-start"> mdi-cancel </v-icon>
                    <span class="justify-end"> Clear ALL </span>
                </div>
            </v-card>
        </v-menu>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import { log } from '@/lib/logging'
import { useImageStore } from '@/lib/store'

export default defineComponent({
    name: 'UploadControl',
    setup() {
        const store = useImageStore()
        const file = ref<FileList | File[]>()
        const form = ref<HTMLInputElement>()
        return {
            store,
            file,
            form,
        }
    },
    methods: {
        doupload(evt: Event) {
            const target = evt.target as HTMLInputElement
            if (target.files) {
                this.store.doupload(target.files)
            } else {
                log.debug('No files selected')
            }
        },
    },
    mounted() {
        log.debug('UploadControl mounted', this.file)
    },
})
</script>

<style>
.menu-btn-a {
    width: 100%;
    background-color: lightgrey;
    color: black;
    padding: 10px;
}

.menu-btn-b {
    width: 100%;
    background-color: #00ff00;
    color: black;
    padding: 10px;
}

.menu-btn-c {
    width: 100%;
    background-color: lightgreen;
    color: black;
    padding: 10px;
}
.menu-btn-d {
    width: 100%;
    background-color: red;
    font-weight: bold;
    color: white;
    padding: 10px;
}
</style>
