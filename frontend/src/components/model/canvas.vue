<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-card v-else>
        <v-card-title>
            {{ file.name }}
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
                        {{ file.name }}
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
                :ref="file.name"
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
        file: {
            type: File,
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
    fetch() {
        return new Promise((resolve, _reject) => {
            let reader = new FileReader()
            reader.onload = (_e) => {
                this.doload()
                resolve()
            }
            reader.readAsDataURL(this.file)
        })
    },
    methods: {
        async doload() {
            const img = document.createElement("img")
            const ref = await this.get_ref(this.file.name)
            const out = await this.get_ref("output")

            const ctx = ref.getContext("2d")

            if (out.clientWidth < this.file.width) {
                this.resultWidth = out.clientWidth
                this.resultHeight =
                    (this.file.height * this.resultWidth) / this.file.width
            } else {
                this.resultWidth = this.file.width
                this.resultHeight = this.file.height
            }

            img.src = this.file.dataURL
            img.width = this.resultWidth
            img.height = this.resultHeight
            this.img = img
            this.model.detect(img).then((predictions) => {
                console.log("predictions", predictions)
                this.json_txt = JSON.stringify(predictions, null, 2)
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
                            `${prediction.class} ${prediction.score.toFixed(
                                2
                            )}`,
                            x + width + 5,
                            y + height + 10
                        )
                    })
                }
            })
        },
    },
}
</script>
