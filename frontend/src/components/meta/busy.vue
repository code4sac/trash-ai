<template>
    <v-sheet
        class="d-flex mb-6 border"
        height="500"
    >
        <v-row
            align="center"
            justify="center"
        >
            <v-progress-circular
                indeterminate
                color="primary"
                size="70"
            />
            <br />
            <b class="ma-10">Loading...</b>
        </v-row>
    </v-sheet>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Busy',
    setup() {
        return {}
    },
})
</script>
