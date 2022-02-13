<template>
    <nav-base>
            <sections-global />
            <Nuxt />
    </nav-base>
</template>
<script>
export default {
    name: "Default",
    head: {
        title: "Welcome",
        titleTemplate: "%s - trash.ai",
    },
    computed: {
        mid_margin() {
            if (this.is_mobile) {
                return "12"
            } else {
                return "10"
            }
        },
        col_margin() {
            if (this.is_mobile) {
                return "0"
            } else {
                return "1"
            }
        },
    },
}
</script>
