<template>
    <meta-busy v-if="$fetchState.pending" />
    <div v-else >
    Hello world
    </div>
</template>
<script>
export default {
    data() {
        return {
            model: "",
        }
    },
    async fetch() {
        return new Promise((resolve, _reject) => {
            resolve()
        })
    },
}
</script>
