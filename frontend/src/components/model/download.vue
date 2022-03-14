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
    },
    data() {
        return {
            dodownload: null,
        }
    },
    async mounted() {
        console.log("loaded", this.item)
        const img = document.createElement("img")
        const ref = await this.get_ref(this.item.key)
        const ctx = ref.getContext("2d")
        img.onload = () => {
            this.model.detect(img).then(async (predictions) => {
                console.log("predictions", predictions)
                this.json_txt = JSON.stringify(predictions, null, 2)
                ctx.clearRect(0, 0, this.item.width, this.item.height)
                ctx.drawImage(img, 0, 0, this.item.width, this.item.height)
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
    },
}
</script>
