<template>
    <span v-if="vertical" :style="style" />
    <div v-else :style="style" />
</template>
<script>
export default {
    props: {
        thickness: {
            type: String,
            default: "1px",
        },
        color: {
            type: String,
            default: "black",
        },
        type: {
            type: String,
            default: "solid",
        },
        background_color: {
            type: String,
            default: "transparent",
        },
        vertical: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        style() {
            if (this.vertical) {
                return {
                    "border-left": `${this.thickness} ${this.type} ${this.color}`,
                    height: "auto",
                }
            } else {
                return {
                    "border-top": `${this.thickness} ${this.type} ${this.color}`,
                    "background-color": this.background_color,
                }
            }
        },
    },
}
</script>
