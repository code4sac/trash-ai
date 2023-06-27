<!-- eslint-disable prettier/prettier -->
<template>
    <div
        class="mx-0 border"
    >
        <div class="ml-3" :id="item.filename + '-test-id'">
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
        <div>
            <v-img
                class="align-center"
                width="300"
                aspect-ratio="1"
                :src="item.smalldataUrl"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { log } from '@/lib/logging'
import { Display } from '@/lib/models'

interface State {
    loaded: boolean
    display: Display | null
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
        log.debug('item', this.display)
    },
})
</script>
