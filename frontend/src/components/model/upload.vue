<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-container ref="cont" v-else>
        <input
            type="file"
            multiple
            ref="file"
            style="display: none"
            @change="doupload($event.target.files)"
            accept="image/*"
        />
        <v-card
            min-height="300px"
            id="droparea"
            ref="droparea"
            v-cloak
            @drop.prevent="doupload($event.dataTransfer.files)"
            @dragover.prevent
        >
            <v-card-title @click="$refs.file.click()" class="secondary">
                <v-spacer />
                Drop files below / click here to upload
                <v-icon> mdi-upload </v-icon>
                <v-spacer />
            </v-card-title>
            <v-card-text>
                <v-data-table
                    v-if="uploads.length > 0"
                    :headers="headers"
                    :items="uploads"
                    item-key="key"
                    disable-pagination
                    hide-default-footer
                    show-expand
                    :expanded="expanded"
                    @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
                >
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip z-index="1000" top>
                            <template v-slot:activator="{ on: tt }">
                                <v-btn
                                    v-on="tt"
                                    small
                                    icon
                                    color="red"
                                    @click="doremove(item)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span> Remove from list </span>
                        </v-tooltip>
                        <model-download
                            :item="item"
                            :model="model"
                            :name_map="name_map"
                        />
                    </template>
                    <template v-slot:[`item.thumb`]="{ item }">
                        <v-img
                            :src="item.src"
                            max-width="100"
                            contain
                            height="100"
                            aspect-ratio="1"
                        />
                    </template>
                    <template v-slot:expanded-item="{ item }">
                        <td colspan="100%" class="pa-0">
                            <model-canvas
                                :model="model"
                                :name_map="name_map"
                                :item="item"
                                :pwidth="dropwidth"
                            />
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
require("@tensorflow/tfjs-backend-cpu")
require("@tensorflow/tfjs-backend-webgl")
import * as tf from "@tensorflow/tfjs"

export default {
    data() {
        return {
            /**
             * @type {tf.GraphModel}
             */
            model: null,
            filter: "",
            /**
             * @type {Array<Object<{
                key: string,
                file: File,
                src: string,
             }>}
             */
            uploads: [],
            expanded: [],
            name_map: [],
        }
    },
    computed: {
        title() {
            return `Upload File(s)`
        },
        dropwidth() {
            const width = document.getElementById("droparea").clientWidth - 100
            return `${width}`
        },
        headers() {
            return [
                {
                    text: "Actions",
                    value: "actions",
                    align: "left",
                    sortable: false,
                },
                {
                    text: "Name",
                    value: "file.name",
                    align: "left",
                    sortable: false,
                },
                {
                    text: "Size",
                    value: "file.size",
                    align: "left",
                    sortable: false,
                },
                {
                    text: "Thumb",
                    value: "thumb",
                    align: "left",
                    sortable: false,
                },
            ]
        },
    },
    fetch() {
        return new Promise(async (resolve, _reject) => {
            const path = `/model/model.json`
            this.model = await tf.loadGraphModel(path)
            this.name_map = await (
                await fetch(path, { credentials: "include" })
            ).json()
            console.log("model loaded", this.name_map, this.model)
            resolve()
        })
    },
    methods: {
        async submitfile(file) {
            let formData = new FormData()
            formData.append("file", file)
            await this.$axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        },
        async doremove(sub) {
            console.log("remove", sub)
            this.uploads = this.uploads.filter((item) => item.key !== sub.key)
        },
        async doupload(files) {
            ;[...files].forEach(async (file) => {
                const img = new Image()
                const reader = new FileReader()
                reader.onload = () => {
                    const key = this.$md5.str(reader.result)
                    if (this.uploads.find((item) => item.key === key)) {
                        console.log("already exists", key)
                        return
                    }
                    img.onload = async () => {
                        await this.submitfile(file)
                        const ins = {
                            width: img.width,
                            height: img.height,
                            key: key,
                            src: reader.result,
                            file: file,
                        }
                        this.uploads.push(ins)
                        this.expanded.push(ins)
                        console.log("upload", ins)
                    }
                    img.src = reader.result
                }
                reader.readAsDataURL(file)
            })
        },
    },
}
</script>
