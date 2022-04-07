<template>
    <v-card>
        <v-card-title>
            {{ item.filename }}
            <model-meta :item="item" :jtxt="json_txt" />
        </v-card-title>
        <v-card-text>
            <canvas :ref="item.hash" :width="maxwidth" :height="maxheight" />
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
        pwidth: {
            type: Number,
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
            maxwidth: 0,
            maxheight: 0,
        }
    },
    async mounted() {
        console.log("loaded", this.item)
        const img = document.createElement("img")
        img.onload = () => {
            if (img.width > this.pwidth) {
                this.maxwidth = this.pwidth
                this.maxheight =
                    (img.height * this.maxwidth) / img.width
            } else {
                this.maxwidth = img.width
                this.maxheight = img.height
            }
            img.width = this.maxwidth
            img.height = this.maxheight
            this.imageChange(img, this.item)
        }
        img.src = this.item.dataUrl
    },
}
</script>
