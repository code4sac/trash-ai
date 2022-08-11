<template>
    <v-progress-linear
        v-if="progress.total > 0"
        v-model="progress.percent"
        color="green"
        striped
        height="25"
    >
        <span class="text-truncate">
            <strong>
                {{ progress.name }} ({{ progress.complete }} /
                {{ progress.total }})
            </strong>
            {{ progress.current }}
        </span>
    </v-progress-linear>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'
export default defineComponent({
    name: 'Progress',
    props: {
        progress: {
            type: m.Progress,
            required: true,
        },
    },
})
</script>
