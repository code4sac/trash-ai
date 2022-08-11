<template>
    <span>
        <v-tooltip
            z-index="1000"
            bottom
        >
            <template v-slot:activator="{ on: tt }">
                <span v-on="tt">
                    <v-btn
                        rounded
                        class="green"
                        @click="do_sampleupload"
                    >
                        <v-icon> mdi-image-multiple </v-icon>
                        Show Samples
                    </v-btn>
                </span>
            </template>
            <span> Show Sample Images</span>
        </v-tooltip>
    </span>
</template>
<script>
export default {
    methods: {
        async do_sampleupload() {
            let files = await this.sample_files()
            await this.doupload(files)
        },
    },
}
</script>
