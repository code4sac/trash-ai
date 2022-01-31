<template>
    <popup-base :kid="kid">
        <template v-slot:header>
            {{ title }}
        </template>
        <template v-slot:header-right>
            <clip-button
                v-if="copy"
                :clipcontent="copy_content"
                text="Copy"
                :kid="kid"
            />
        </template>
        <pre>{{ copy }}</pre>
    </popup-base>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        kid: {
            type: String,
            required: true,
        },
        copy: {
            type: undefined,
            default: null,
        },
    },
    computed: {
        copy_content() {
            if (typeof this.copy === "object") {
                return JSON.stringify(this.copy, null, 4);
            } else {
                return this.copy;
            }
        },
    },
};
</script>
