<template>
    <v-card>
        <v-card-title>
            {{ item.file.name }}
            <model-meta :item="item" :jtxt="json_txt" />
        </v-card-title>
        <v-card-text>
            <canvas
                :ref="item.key"
                :width="item.width"
                :height="item.height"
            />
        </v-card-text>
    </v-card>
</template>
<script>
import * as tf from "@tensorflow/tfjs"

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        model: {
            type: Object,
            required: true,
        },
        pwidth: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            img: null,
            curtab: "image",
            resultWidth: 0,
            resultHeight: 0,
            dialog: false,
            maximize: false,
            json_txt: "",
        }
    },
    async mounted() {
        console.log("loaded", this.item)
        const img = document.createElement("img")
        // const ref = await this.get_ref(this.item.key)
        // const ctx = ref.getContext("2d")
        img.onload = () => {
            this.imageChange(img)
        }
        img.src = this.item.src
        img.width = this.item.width
        img.height = this.item.height
    },
    methods: {
        async imageChange(e) {
            const c = await this.get_ref(this.item.key)
            const ctx = c.getContext("2d")
            this.cropToCanvas(e, c, ctx)
            let [modelWidth, modelHeight] =
                this.model.inputs[0].shape.slice(1, 3)
            const input = tf.tidy(() => {
                return tf.image
                    .resizeBilinear(tf.browser.fromPixels(c), [
                        modelWidth,
                        modelHeight,
                    ])
                    .div(255.0)
                    .expandDims(0)
            })
            this.model.executeAsync(input).then((res) => {
                // Font options.
                console.log('async exec', res)
                const font = "16px sans-serif"
                ctx.font = font
                ctx.textBaseline = "top"

                const [boxes, scores, classes, valid_detections] = res
                console.log('boxes', boxes)
                const boxes_data = boxes.dataSync()
                const scores_data = scores.dataSync()
                console.log('scores', scores_data)
                const classes_data = classes.dataSync()
                console.log('classes', classes_data)
                const valid_detections_data = valid_detections.dataSync()[0]
                console.log('valid_detections', valid_detections_data)

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
        cropToCanvas(image, canvas, ctx) {
            const naturalWidth = image.naturalWidth
            const naturalHeight = image.naturalHeight
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = "#000000"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            const ratio = Math.min(
                canvas.width / naturalWidth,
                canvas.height / naturalHeight
            )
            const newWidth = Math.round(naturalWidth * ratio)
            const newHeight = Math.round(naturalHeight * ratio)
            console.log(newWidth, newHeight)
            console.log(canvas.width, canvas.height)
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
    },
}
</script>
