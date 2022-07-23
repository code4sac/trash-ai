<template>
    <div class="ma-0 border">
        <div class="ml-3">
            <b>{{ item.filename }}</b>
        </div>
        <v-divider
            class="my-0"
            thickness="2"
        />
        <div class="ml-3">
            <v-icon
                v-if="item.gps"
                color="primary"
            >
                mdi-map-marker
            </v-icon>
            <v-icon
                v-if="item.has_detection"
                color="green"
            >
                mdi-delete-variant
            </v-icon>
            <v-icon
                v-else
                color="red"
            >
                mdi-code-not-equal
            </v-icon>
        </div>
        <v-divider
            class="my-0"
            thickness="2"
        />
        <v-img
            width="200"
            :aspect-ratio="1"
            :src="item.thumbdataUrl"
        />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'

interface State {
    loaded: boolean
    display: m.Display | null
}

export default defineComponent({
    name: 'Thumb',
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data(): State {
        return {
            loaded: false,
            display: null,
        }
    },
    mounted() {
        // @ts-ignore
        this.display = this.item
        console.log('item', this.display)
    },
})
</script>
