<template>
    <Busy v-if="!loaded" />
    <GMapMap
        v-else
        :center="center"
        :zoom="zoom"
        map-type-id="terrain"
        style="width: 100%; height: 300px"
    >
        <GMapCluster>
            <GMapMarker
                :position="position"
                :clickable="true"
                :draggable="true"
                @click="center = position"
            />
        </GMapCluster>
    </GMapMap>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Coordinate } from '@/lib/models'

interface State {
    center: Coordinate | null
    position: Coordinate | null
    zoom: number
    loaded: boolean
}

export default defineComponent({
    name: 'GMap',
    props: {
        gps: {
            type: Object,
            required: true,
        },
    },
    data(): State {
        return {
            center: null,
            position: null,
            zoom: 15,
            loaded: false,
        }
    },
    mounted() {
        // @ts-ignore
        this.center = this.gps
        // @ts-ignore
        this.position = this.gps
        this.loaded = true
    },
})
</script>

<style>
body {
    margin: 0;
}
</style>
