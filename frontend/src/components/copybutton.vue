<template>
    <v-btn
        @click="copy"
        variant="tonal"
    >
        <v-icon size="20">mdi-clipboard-outline</v-icon>
    </v-btn>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useClipboard from 'vue-clipboard3'
export default defineComponent({
    name: 'CopyButton',
    props: {
        text: {
            type: String,
            required: true,
        },
    },
    setup() {
        const { toClipboard } = useClipboard()
        return {
            toClipboard,
        }
    },
    methods: {
        async copy() {
            await this.toClipboard(this.text)
            // @ts-ignore
            this.$root.snack.show({
                message: 'Copied to clipboard',
                color: 'success',
                icon: 'mdi-check',
                timer: 3000,
            })
            console.log('copied', this.text)
        },
    },
})
</script>
