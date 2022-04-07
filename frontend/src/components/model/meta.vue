<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-dialog v-else v-model="dialog" :fullscreen="maximize" width="500">
        <template v-slot:activator="{ on, attrs }">
            <v-tooltip z-index="1000" top>
                <template v-slot:activator="{ on: tt }">
                    <span v-on="tt">
                        <v-btn v-bind="attrs" v-on="on" fab small>
                            <v-icon>mdi-file</v-icon>
                        </v-btn>
                    </span>
                </template>
                <span>Show Metadata</span>
            </v-tooltip>
        </template>
        <v-card>
            <v-card-title>
                {{ item.filename }}
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
                <pre>{{ jtxt }}</pre>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialog: false,
            maximize: false,
            jtxt: null,
        }
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    async fetch() {
        while (this.item.uploaded === null) {
            console.log('waiting for upload')
            await this.$nextTick()
        }
        const meta = await this.getMetaData(this.item)
        this.jtxt = JSON.stringify(meta, null, 2)
    },
}
</script>
