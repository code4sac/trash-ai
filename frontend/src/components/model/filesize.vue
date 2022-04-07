<template>
    <v-chip class="info">{{ item.size }} bytes</v-chip>
</template>
<script>
export default {
    props: {
        item: Object,
        required: true,
    }
};
</script>
