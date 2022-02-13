<template>
    <v-tooltip z-index="1000" top>
        <template v-slot:activator="{ on }">
            <v-btn rounded :class="color" v-on="on" @click="handleDownload">
                <v-icon left>mdi-download</v-icon>
                <slot>JSON</slot>
            </v-btn>
        </template>
        <span>Download {{ filename }}.json</span>
    </v-tooltip>
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            default: "primary",
        },
        filename: {
            type: String,
            required: true,
        },
        data: {
            type: undefined,
            required: true,
            default: () => [],
        },
    },
    methods: {
        handleDownload() {
            let content = JSON.stringify(this.data, null, 4)

            if (content === null) {
                this.$error("Download content is empty")
                return
            }

            const blob = new Blob([content], {
                type: `application/${this.fileType}`,
            })
            const link = document.createElement("a")
            link.href = window.URL.createObjectURL(blob)
            link.download = `${this.filename}.json`
            link.click()
            this.$success("Download success")
        },
    },
}
</script>
