<template>
    <v-chip v-bind="$attrs" :class="cls" :style="style">
        {{ value }} %
    </v-chip>
</template>
<script>
export default {
    props: {
        perc: {
            type: Number,
            required: true,
        },
        greenToRed: {
            type: Boolean,
            default: false,
        },
        nocolor: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        red2green(perc) {
            var r,
                g,
                b = 0
            if (perc < 50) {
                r = 255
                g = Math.round(5.1 * perc)
            } else {
                g = 255
                r = Math.round(510 - 5.1 * perc)
            }
            var h = r * 0x10000 + g * 0x100 + b * 0x1
            return "#" + ("000000" + h.toString(16)).slice(-6)
        },
        green2red(perc) {
            var r,
                g,
                b = 0
            if (perc < 50) {
                g = 255
                r = Math.round(5.1 * perc)
            } else {
                r = 255
                g = Math.round(510 - 5.1 * perc)
            }
            var h = r * 0x10000 + g * 0x100 + b * 0x1
            return "#" + ("000000" + h.toString(16)).slice(-6)
        },
    },
    computed: {
        value() {
            return _.round(this.perc, 1)
        },
        cls() {
            return {
                "font-weight-bold": true,
            }
        },
        style() {
            if (this.nocolor) {
                return {}
            }
            return {
                backgroundColor: this.greenToRed
                    ? this.green2red(this.perc)
                    : this.red2green(this.perc),
                color: "black",
            }
        },
    },
}
</script>
