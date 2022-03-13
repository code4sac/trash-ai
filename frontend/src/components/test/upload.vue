<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-container ref="cont" v-else>
        <vue-dropzone
            id="dropzone"
            ref="dropzone"
            @vdropzone-file-added="doupload"
            @vdropzone-removed-file="doremove"
            :options="dropzoneOptions"
        />
        <div
            v-for="item in uploads"
            :key="item.name"
            reverse-transition="fade-transition"
            transition="fade-transition"
        >
            <model-canvas :model="model" :file="item" />
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
             * @type {Array<File>}
             */
            uploads: [],
        }
    },
    computed: {
        dropzoneOptions() {
            return {
                url: this.noop,
                thumbnailWidth: 200,
                addRemoveLinks: true,
                maxFilesize: 10,
                acceptedFiles: "image/*",
            }
        },
        title() {
            return `Upload File(s)`
        },
    },
    async fetch() {
        this.model = await cocoSsd.load()
        console.log("model loaded", this.model)
    },
    methods: {
        async noop() {},
        async submitfile(file) {
            let formData = new FormData()
            formData.append("file", file)
            await this.$axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        },
        async doremove(file) {
            console.log("remove", file)
            this.uploads = this.uploads.filter(
                (item) => item.name !== file.name
            )
        },
        async doupload(file) {
            console.log("upload", file)
            await this.submitfile(file)
            this.uploads.push(file)
        },
    },
}
</script>
