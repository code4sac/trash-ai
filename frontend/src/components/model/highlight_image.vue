<template>
    <div
        id="highlightdiv"
        v-if="is_active"
        :height="max_height"
        :width="max_width"
        :style="{
            top: appstore.highlight_image.y + 'px',
            left: appstore.highlight_image.x + 'px',
            position: 'absolute',
            'z-index': 10000,
            border: '10px solid #000',
        }"
    >
        <div class="hl-container">
            <v-row>
                <v-col>
                    <v-chip>
                        {{
                            Math.round(
                                appstore.highlight_image.rect?.width ?? 0,
                            ) +
                            ' x ' +
                            Math.round(
                                appstore.highlight_image.rect?.height ?? 0,
                            )
                        }}
                    </v-chip>
                </v-col>
            </v-row>
            <img
                v-if="appstore.highlight_image.img"
                :src="appstore.highlight_image.img?.image"
                :height="appstore.highlight_image.img?.height"
                :width="appstore.highlight_image.img?.width"
            />
            <v-row>
                <v-col>
                    <v-chip
                        v-if="appstore.highlight_image.rect?.remove"
                        color="red"
                        text-color="white"
                        class="ma-2"
                    >
                        {{
                            appstore.highlight_image.rect?.remove
                                ? 'Not Trash'
                                : ''
                        }}
                    </v-chip>
                    <span
                        :class="
                            (appstore.highlight_image.rect?.remove ?? false) ||
                            (appstore.highlight_image.rect?.correction ??
                                false)
                                ? 'text-h4 text-decoration-line-through'
                                : 'text-h4'
                        "
                    >
                        {{ appstore.highlight_image.rect?.label }}
                        ( {{ appstore.highlight_image.rect?.score ?? '0' }} )
                    </span>
                </v-col>
            </v-row>
            <v-row v-if="appstore.highlight_image.rect?.correction">
                <v-col>
                    <span class="text-h4">
                        <v-chip color="green"> Corrected </v-chip>
                        {{ appstore.highlight_image.rect?.correction }}
                    </span>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useAppStore, useCanvas } from '@/lib'

export default defineComponent({
    name: 'HightlightImage',
    setup() {
        const appstore = useAppStore()
        const canvas = useCanvas()
        return {
            appstore,
            canvas,
        }
    },
    computed: {
        max_height() {
            window.innerHeight > 500 ? 500 : window.innerHeight - 20
        },
        max_width() {
            window.innerWidth > 500 ? 500 : window.innerWidth - 20
        },
        is_active() {
            return this.canvas.conditions().mouse.hover
        },
        ostyle() {
            return {
                top: this.appstore.highlight_image.x,
                left: this.appstore.highlight_image.y,
            }
        },
    },
})
</script>
<style>
.body-text {
    background-color: black;
    color: white;
}

.hl-container {
    background-color: black;
    color: white;
}
</style>
