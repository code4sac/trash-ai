<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-container v-else>
        <model-droparea :inprogress="inprogress">
            <v-card v-if="has_uploads">
                <v-card-title v-if="inprogress.length > 0">
                    Uploading {{ inprogress.length }} files
                </v-card-title>
                <v-card-text v-if="inprogress.length > 0">
                    <ModelInprogessTable />
                </v-card-text>
                <ModelImageRows />
            </v-card>
        </model-droparea>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            expanded: [],
            page_width: 0,
        }
    },
    computed: {
        title() {
            return `Upload File(s)`
        },
    },
    async fetch() {
        // console.log(this.uploads)
    },
    async mounted() {
        const pref = await this.get_ref("cont")
        this.page_width = pref.clientWidth
    },
}
</script>
