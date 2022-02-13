<template>
    <span @click="copyclick">
        <span ref="content">
            <slot />
        </span>
        <v-snackbar v-model="show" timeout="2000" bottom>
            {{ content }} copied to clipboard
        </v-snackbar>
    </span>
</template>
<script>
export default {
    data() {
        return {
            show: false,
            content: '',
        }
    },
    methods: {
        get_content() {
        },
        async copyclick() {
            this.show = true
            while (!this.$refs["content"]) {
                await new Promise((resolve) => setTimeout(resolve, 100))
            }
            this.content = _.trim(this.$refs.content.innerText)
            navigator.clipboard.writeText(this.content)
            setTimeout(() => {
                this.show = false
                this.content = ''
            }, 1000)
        },
    },
}
</script>
