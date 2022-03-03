<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-container v-else>
        <vue-dropzone id="upload" :options="dropzoneOptions" />
        <div id="output" />
    </v-container>
</template>
<script>
// import * as tf from "@tensorflow/tfjs"
// import { loadGraphModel } from "@tensorflow/tfjs-converter"
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
        }
    },
    computed: {
        dropzoneOptions() {
            return {
                url: this.upload,
                thumbnailWidth: 200,
                addRemoveLinks: true,
                maxFiles: 1,
                maxFilesize: 10,
                acceptedFiles: "image/*",
            }
        },
        title() {
            return `Uploade Files`
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
        /* loadGraphModel(MODEL_URL).then((model) => { */
        /*     this.model = model */
        /*     resolve() */
        /* }) */
        /* this.$axios.get("/list_files").then((response) => { */
        /*     console.log("list_files", response) */
        /*     this.list = response.data.files */
        /* }) */
    },
    methods: {
        async submitfile(file) {
            this.uploads[file.name] = {
                file: file,
                progress: 0,
                status: "pending",
            }
            let formData = new FormData()
            formData.append("file", file)
            await this.$axios
                .post("/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (e) => {
                        this.uploads[file.name].progress = Math.round(
                            (e.loaded * 100) / e.total
                        )
                        console.log(
                            "progress",
                            this.uploads[file.name].progress
                        )
                    },
                })
                .then((res) => {
                    this.$success("Uploaded successfully", res)
                    this.$fetch()
                })
                .catch((err) => {
                    this.$error("Upload failed", err)
                })
        },
        async upload(val) {
            const output = document.getElementById("output")
            const reader = new FileReader()
            output.innerHTML = ""
            this.file = val[0]
            console.log("fileurl", reader.readAsDataURL(val[0]))
            /* const img = document.createElement("img") */
            /* img.style.width = this.file.width + "px" */
            /* img.style.height = this.file.height + "px" */
            /* console.log("file", this.file) */
            /* img.src = this.file.dataURL */
            /* output.appendChild(img) */
            /* console.log("img", img) */
            /* const predictions = this.model.detect(img) */
            /* console.log("predictions", predictions) */
            // const img = new Image(this.file.width, this.file.height)
            /* // const blob = new Blob([this.file], { type: "image/jpeg" }) */
            /* const dat = Uint8Array.from(this.file.arrayBuffer()) */
            /* tf.browser.fromPixels({ */
            /*     data: dat, */
            /*     width: this.file.width, */
            /*     height: this.file.height, */
            /* }) */
            /* // console.log(img) */
            /* // output.appendChild(img) */
        },
        cropToCanvas(image, canvas, ctx) {
            const naturalWidth = image.naturalWidth
            const naturalHeight = image.naturalHeight

            // canvas.width = image.width;
            // canvas.height = image.height;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = "#000000"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            const ratio = Math.min(
                canvas.width / image.naturalWidth,
                canvas.height / image.naturalHeight
            )
            const newWidth = Math.round(naturalWidth * ratio)
            const newHeight = Math.round(naturalHeight * ratio)
            ctx.drawImage(
                image,
                0,
                0,
                naturalWidth,
                naturalHeight,
                (canvas.width - newWidth) / 2,
                (canvas.height - newHeight) / 2,
                newWidth,
                newHeight
            )
        },
        onImageChange(e) {
            const c = document.getElementById("canvas")
            const ctx = c.getContext("2d")
            this.cropToCanvas(e.target, c, ctx)
            let [modelWidth, modelHeight] =
                this.state.model.inputs[0].shape.slice(1, 3)
            const input = tf.tidy(() => {
                return tf.image
                    .resizeBilinear(tf.browser.fromPixels(c), [
                        modelWidth,
                        modelHeight,
                    ])
                    .div(255.0)
                    .expandDims(0)
            })
            this.state.model.executeAsync(input).then((res) => {
                // Font options.
                const font = "16px sans-serif"
                ctx.font = font
                ctx.textBaseline = "top"

                const [boxes, scores, classes, valid_detections] = res
                const boxes_data = boxes.dataSync()
                const scores_data = scores.dataSync()
                const classes_data = classes.dataSync()
                const valid_detections_data = valid_detections.dataSync()[0]

                tf.dispose(res)

                var i
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= c.width
                    x2 *= c.width
                    y1 *= c.height
                    y2 *= c.height
                    const width = x2 - x1
                    const height = y2 - y1
                    const klass = names[classes_data[i]]
                    const score = scores_data[i].toFixed(2)

                    // Draw the bounding box.
                    ctx.strokeStyle = "#00FFFF"
                    ctx.lineWidth = 4
                    ctx.strokeRect(x1, y1, width, height)

                    // Draw the label background.
                    ctx.fillStyle = "#00FFFF"
                    const textWidth = ctx.measureText(
                        klass + ":" + score
                    ).width
                    const textHeight = parseInt(font, 10) // base 10
                    ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4)
                }
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= c.width
                    y1 *= c.height
                    const klass = names[classes_data[i]]
                    const score = scores_data[i].toFixed(2)

                    // Draw the text last to ensure it's on top.
                    ctx.fillStyle = "#000000"
                    ctx.fillText(klass + ":" + score, x1, y1)
                }
            })
        },
    },
}
</script>
