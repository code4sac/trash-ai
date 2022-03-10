<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-container v-else>
        <vue-dropzone
            id="dropzone"
            ref="dropzone"
            @vdropzone-success="doupload"
            :options="dropzoneOptions"
        />
        <canvas ref="canvas" :width="resultWidth" :height="resultHeight" />
        <div id="output" ref="output" />
    </v-container>
</template>
<script>
require("@tensorflow/tfjs-backend-cpu")
require("@tensorflow/tfjs-backend-webgl")
const cocoSsd = require("@tensorflow-models/coco-ssd")
// const MODEL_URL = "web_model/model.json"

export default {
    data() {
        return {
            file: null,
            filter: "",
            in_progress: false,
            uploads: {},
            list: [],
            /**
             * Dropzone options
             * @type {cocoSsd.ObjectDetection}
             */
            model: null,
            /** @type {File} */
            file: null,
            resultWidth: 0,
            resultHeight: 0,
        }
    },
    computed: {
        dropzoneOptions() {
            return {
                url: this.noop,
                thumbnailWidth: 200,
                addRemoveLinks: true,
                maxFiles: 1,
                maxFilesize: 10,
                acceptedFiles: "image/*",
            }
        },
        title() {
            return `Upload File`
        },
        headers() {
            return [
                {
                    text: "key",
                    value: "Key",
                    sortable: true,
                },
                {
                    text: "Last Modified",
                    value: "LastModified",
                    sortable: true,
                },
                {
                    text: "ETag",
                    value: "ETag",
                    sortable: true,
                },
                {
                    text: "Size",
                    value: "Size",
                    sortable: true,
                },
                {
                    text: "Storage Class",
                    value: "StorageClass",
                    sortable: true,
                },
            ]
        },
    },
    async fetch() {
        this.model = await cocoSsd.load()
        console.log("model loaded", this.model)
    },
    methods: {
        async noop() {},
        async loadpred(img) {
            const ref = await this.get_ref("canvas")
            const ctx = ref.getContext("2d")
            const dz = await this.get_ref("dropzone")
            const out = await this.get_ref("output")
            this.model.detect(img).then((predictions) => {
                console.log("predictions", predictions)
                out.innerHTML = `<pre>${JSON.stringify(predictions, null, 2)}</pre>`
                img.onload = () => {
                    ctx.clearRect(0, 0, this.resultWidth, this.resultHeight)
                    ctx.drawImage(
                        img,
                        0,
                        0,
                        this.resultWidth,
                        this.resultHeight
                    )
                    predictions.forEach((prediction) => {
                        const x = prediction.bbox[0]
                        const y = prediction.bbox[1]
                        const width = prediction.bbox[2]
                        const height = prediction.bbox[3]
                        ctx.strokeStyle = "red"
                        ctx.lineWidth = 4
                        ctx.strokeRect(x, y, width, height)
                        ctx.font = "20px sans-serif"
                        ctx.fillStyle = "red"
                        ctx.fillText(
                            prediction.class,
                            x + width + 5,
                            y + height + 10
                        )
                    })
                    dz.removeAllFiles()
                }
            })
        },
        async doupload(file, _response) {
            const img = document.createElement("img")
            let reader = new FileReader()
            reader.onload = (e) => {
                this.resultHeight = file.height
                this.resultWidth = file.width
                this.file = file
                img.src = e.target.result
                img.width = this.resultWidth
                img.height = this.resultHeight
                this.loadpred(img)
            }
            reader.readAsDataURL(file)
        },
    },
}
</script>
