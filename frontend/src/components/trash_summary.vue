<template>
    <v-row class="border">
        <v-col class="border">
            <UploadControl />
        </v-col>
        <v-col class="border">
            <b>Space Used</b>
            <v-chip
                class="ml-3"
                color="red"
                text-color="white"
                variant="outlined"
            >
                {{ store.capacity.usage }} MB
            </v-chip>
        </v-col>
        <v-col class="border">
            <b> Total Detections </b>
            <v-chip color="green"> {{ summary.total_detections }}</v-chip>
        </v-col>
        <v-col class="border">
            <b> Unique Detections </b>
            <v-chip color="green"> {{ summary.unique_detections }}</v-chip>
        </v-col>
        <v-col class="border">
            <b> No Detections </b>
            <v-chip color="red">
                {{ summary.no_detection_hashes.length }}</v-chip
            >
        </v-col>
    </v-row>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'
export default defineComponent({
    name: 'TrashSummary',
    setup() {
        const store = m.useImageStore()
        return {
            store,
        }
    },
    computed: {
        summary(): m.Summary {
            return this.store.summary
        },
    },
})
</script>
