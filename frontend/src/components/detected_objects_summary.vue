<template>
    <div>
        <div
            class="mt-5"
            v-if="sdata?.detectedObjects.length === 0"
        />
        <v-chip
            v-for="(obj, idx) in sdata?.detectedObjects"
            :key="'dobj' + idx"
        >
            <router-link :to="{ name: 'detection', params: { name: obj } }">
                {{ obj }}
            </router-link>
        </v-chip>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import { SaveData } from '@/lib/models'

export default defineComponent({
    name: 'DetectedObjectsSummary',
    props: {
        sdata: {
            type: SaveData,
            required: true,
        },
    },
})
</script>
