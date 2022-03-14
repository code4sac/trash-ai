<template>
    <v-card>
        <v-card-title>
            {{ item.file.name }}
            <model-meta :item="item" :jtxt="json_txt" />
        </v-card-title>
        <v-card-text>
            <canvas
                :ref="item.key"
                :width="resultWidth"
                :height="resultHeight"
            />
        </v-card-text>
    </v-card>
</template>
<script>
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
        const ref = await this.get_ref(this.item.key)

        const ctx = ref.getContext("2d")

        if (this.pwidth < this.item.width) {
            this.resultWidth = this.pwidth
            this.resultHeight =
                (this.item.height * this.resultWidth) / this.item.width
        } else {
            this.resultWidth = this.item.width
            this.resultHeight = this.item.height
        }

        img.onload = () => {
            this.model.detect(img).then(async (predictions) => {
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
