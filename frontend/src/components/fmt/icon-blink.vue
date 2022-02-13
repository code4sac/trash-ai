<template>
    <v-icon v-if="disable" v-bind="$attrs" :color="disable_color">
        <slot />
    </v-icon>
    <v-icon v-else v-bind="$attrs" :color="blink_color">
        <slot />
    </v-icon>
</template>

<script>
export default {
    data() {
        return {
            title: "",
            perc: 0,
            blink_interval: null,
            sleep_period: 750,
            blink_color: "",
        }
    },
    props: {
        disable: {
            type: Boolean,
            default: false,
        },
        disable_color: {
            type: String,
            default: "success",
        },
        greenToRed: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        sleep(color) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.blink_color = color
                    resolve()
                }, this.sleep_period)
            })
        },
    },
    async created() {
        const colors = ["error", "yellow"]
        if (!this.blink_interval) {
            this.blink_interval = true
            while (true) {
                await this.sleep(colors[0])
                await this.sleep(colors[1])
            }
        }
    },
}
</script>
