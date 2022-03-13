<template>
    <v-card>
        <v-card-title>
            {{ item.file.name }}
            <v-dialog v-model="dialog" :fullscreen="maximize" width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-tooltip z-index="1000" top>
                        <template v-slot:activator="{ on: tt }">
                            <span v-on="tt">
                                <v-btn v-bind="attrs" v-on="on" icon>
                                    <v-icon>mdi-file</v-icon>
                                </v-btn>
                            </span>
                        </template>
                        <span>Show Metadata</span>
                    </v-tooltip>
                </template>
                <v-card>
                    <v-card-title>
                        {{ item.file.name }}
                        <v-spacer />
                        <v-btn icon @click="maximize = !maximize">
                            <v-icon v-if="!maximize">mdi-fullscreen</v-icon>
                            <v-icon v-else>mdi-fullscreen-exit</v-icon>
                        </v-btn>
                        <v-btn icon @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text class="mt-3">
                        <pre>{{ json_txt }}</pre>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-card-title>
        <v-card-text>
            <canvas
                :ref="item.key"
                :width="resultWidth"
                :height="resultHeight"
            />
            <div ref="output" />
        </v-card-text>
    </v-card>
</template>
<script>
const cocoSsd = require("@tensorflow-models/coco-ssd")

export default {
    props: {
        model: {
            type: cocoSsd.ObjectDetection,
            required: true,
        },
        item: {
            type: Object,
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
        const ref = await this.get_ref(this.item.key)
        const out = await this.get_ref("output")

        const ctx = ref.getContext("2d")

        if (out.clientWidth < this.item.file.width) {
            this.resultWidth = out.clientWidth
            this.resultHeight =
                (this.item.file.height * this.resultWidth) /
                this.item.file.width
        } else {
            this.resultWidth = this.item.file.width
            this.resultHeight = this.item.file.height
        }

        img.onload = () => {
            this.model.detect(img).then((predictions) => {
                console.log("predictions", predictions)
                this.json_txt = JSON.stringify(predictions, null, 2)
                ctx.clearRect(0, 0, this.resultWidth, this.resultHeight)
                ctx.drawImage(img, 0, 0, this.resultWidth, this.resultHeight)
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
                        `${prediction.class} ${prediction.score.toFixed(2)}`,
                        x + width + 5,
                        y + height + 10
                    )
                })
            })
        }
        img.width = this.resultWidth
        img.height = this.resultHeight
        img.src = this.item.src
    },
}
</script>
