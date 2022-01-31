<template>
    <v-chip :color="enabled ? 'success' : 'error'">
        {{ enabled ? true_text : false_text }}
    </v-chip>
</template>
<script>
export default {
    props: {
        true_text: {
            type: String,
            default: "Enabled",
        },
        false_text: {
            type: String,
            default: "Disabled",
        },
        enabled: {
            type: Boolean,
            required: true,
        },
    },
}
</script>
