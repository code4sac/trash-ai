<template>
    <div :style="divstyle">
        <v-row v-for="item in items" :key="item.id">
            <alert-card :item="item" />
        </v-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            title: "",
            items: [],
        }
    },
    computed: {
        divstyle() {
            if (this.is_mobile) {
                return {
                    position: "fixed",
                    width: "300px",
                    right: "0px",
                    "z-index": "1000",
                }
            }
            return {
                position: "fixed",
                right: "0px",
                width: "300px",
                "z-index": "1000",
            }
        },
    },
    created() {
        this.$nuxt.$on("notify", this.open)
        this.$nuxt.$on("notifyremove", this.remove)
    },
    methods: {
        rkey() {
            return Math.random().toString(36).substring(2, 15)
        },
        open(config) {
            config.id = this.rkey()
            if (config.timeout === undefined) {
                config.timeout = 2000
            }
            this.items.push(config)
        },
        remove(id) {
            this.items = this.items.filter((item) => item.id !== id)
        },
    },
}
</script>
