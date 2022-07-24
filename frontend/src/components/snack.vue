<template>
    <v-snackbar
        :color="color"
        :timeout="timer"
        v-model="showSnackbar"
        bottom
        right
    >
        <v-icon left>{{ icon }}</v-icon
        >{{ message }}
    </v-snackbar>
</template>

<script lang="ts">
interface SnackbarProps {
    color: string
    icon: string
    message: string
    timer: number
    showSnackbar: boolean
}
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'vtoast',
    data(): SnackbarProps {
        return {
            showSnackbar: false,
            message: '',
            color: 'success',
            icon: 'mdi-check',
            timer: 3000,
        }
    },
    methods: {
        show(data: SnackbarProps) {
            this.message = data.message || 'missing "message".'
            this.color = data.color || 'success'
            this.timer = data.timer || 3000
            this.icon = data.icon || 'mdi-check'
            this.showSnackbar = true
        },
    },
})
</script>
