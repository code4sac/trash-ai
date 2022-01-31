<template>
    <div v-if="content">
        <template v-for="(line, idx) in content.split('\n')">
            <div :key="`${line}-${idx}`">
                {{ line }}
                <br />
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            required: true,
        },
    },
}
</script>
