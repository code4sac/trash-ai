<template>
    <v-chip :class="color_map[status]">
        {{ status | title }}
    </v-chip>
</template>
<script>
export default {
    props: {
        status: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            color_map: {
                idle: "info",
                running: "success",
                pending: "warning",
                failed: "error",
            },
        }
    },
    fetch() {
        return new Promise((resolve, _reject) => {
            resolve()
        })
    },
}
</script>
