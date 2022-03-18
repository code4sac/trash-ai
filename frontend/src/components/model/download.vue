<template>
    <span>
        <v-tooltip z-index="1000" top>
            <template v-slot:activator="{ on: tt }">
                <span v-on="tt">
                    <v-btn icon @click="download">
                        <v-icon>mdi-download</v-icon>
                    </v-btn>
                </span>
            </template>
            <span> Download Full Size Image </span>
        </v-tooltip>
        <canvas
            style="display: none"
            :ref="item.key"
            :width="item.width"
            :height="item.height"
        />
    </span>
</template>
<script>
import * as tf from "@tensorflow/tfjs"

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        name_map: {
            type: Object,
            required: true,
        },
        model: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dodownload: null,
        }
    },
    async mounted() {
        const img = document.createElement("img")
        img.onload = () => {
            this.imageChange(img)
        }
        img.width = this.item.width
        img.height = this.item.height
        img.src = this.item.src
    },
    methods: {
        async download() {
            var canvas = await this.get_ref(this.item.key)
            var image = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream")
            var link = document.createElement("a")
            link.download = `${this.item.key}.png`
            link.href = image
            link.click()
        },
        async imageChange(e) {
            const c = await this.get_ref(this.item.key)
            /**
             * @type {HTMLCanvasElement}
             */
            const ctx = c.getContext("2d")
            this.cropToCanvas(e, c, ctx)
            let [modelWidth, modelHeight] = this.model.inputs[0].shape.slice(
                1,
                3
            )
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
                console.log("async exec", res)
                const font = "14px sans-serif"
                ctx.font = font
                ctx.textBaseline = "top"

                const [boxes, scores, classes, valid_detections] = res
                const boxes_data = boxes.dataSync()
                const scores_data = scores.dataSync()
                const classes_data = classes.dataSync()
                const valid_detections_data = valid_detections.dataSync()[0]
                tf.dispose(res)
                var i
                let jarr = []
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= c.width
                    x2 *= c.width
                    y1 *= c.height
                    y2 *= c.height
                    const width = x2 - x1
                    const height = y2 - y1
                    const score = scores_data[i].toFixed(2)
                    const name = this.name_map[classes_data[i]]
                    jarr.push({
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2,
                        width: width,
                        height: height,
                        score: score,
                        name: name,
                    })
                    // Draw the bounding box.
                    ctx.strokeStyle = "#00FFFF"
                    ctx.lineWidth = 1
                    ctx.strokeRect(x1, y1, width, height)

                    // Draw the label background.
                    ctx.fillStyle = "#00FFFF"
                    const textWidth = ctx.measureText(`${name}:${score}`).width
                    const textHeight = parseInt(font, 10) // base 10
                    ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4)
                }
                this.json_txt = JSON.stringify(jarr, null, 2)
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= c.width
                    y1 *= c.height
                    const score = scores_data[i].toFixed(2)
                    const name = this.name_map[classes_data[i]]

                    // Draw the text last to ensure it's on top.
                    ctx.fillStyle = "#000000"
                    ctx.fillText(`${name}:${score}`, x1, y1)
                }
                ctx.width = c.width
                ctx.height = c.height
            })
        },
        cropToCanvas(image, canvas, ctx) {
            let naturalWidth = image.naturalWidth
            let naturalHeight = image.naturalHeight
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
