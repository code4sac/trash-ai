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
                <v-row
                    v-for="item in uploads"
                    :key="item.key"
                    align="center"
                    no-gutters
                >
                    <v-col cols="11">
                        <v-btn small icon color="red" @click="doremove(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        {{ item.file.name }} ({{ item.file.size }})
                    </v-col>
                    <v-col cols="1">
                        <v-img :src="item.src" contain height="100" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <div
            v-for="item in uploads"
            :key="item.name"
            reverse-transition="fade-transition"
            transition="fade-transition"
        >
            <model-canvas
                :key="item.key + 'canv'"
                :model="model"
                :item="item"
            />
        </div>
    </v-container>
</template>
<script>
require("@tensorflow/tfjs-backend-cpu")
require("@tensorflow/tfjs-backend-webgl")
const cocoSsd = require("@tensorflow-models/coco-ssd")

export default {
    data() {
        return {
            filter: "",
            /**
             * @type {Array<Object<{
                key: string,
                file: File,
                src: string,
             }>}
             */
            uploads: [],
        }
    },
    computed: {
        title() {
            return `Upload File(s)`
        },
    },
    async fetch() {
        this.model = await cocoSsd.load()
        console.log("model loaded", this.model)
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
                        file.width = img.width
                        file.height = img.height
                        await this.submitfile(file)
                        const ins = {
                            key: key,
                            src: reader.result,
                            file: file,
                        }
                        this.uploads.push(ins)
                        console.log("upload", ins.key)
                    }
                    img.src = reader.result
                }
                reader.readAsDataURL(file)
            })
        },
    },
}
</script>
