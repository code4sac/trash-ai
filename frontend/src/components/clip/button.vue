<template>
    <v-tooltip z-index="2000" top>
        <template v-slot:activator="{ on }">
            <v-btn
                @click.prevent.stop="$clippy(clipcontent)"
                v-bind="$attrs"
                :class="cls"
                v-on="on"
            >
                <v-badge
                    v-if="badge"
                    :icon="badge"
                    left
                    overlap
                    class="accent"
                >
                    <v-icon class="mr-3">mdi-content-copy</v-icon>
                </v-badge>
                <div v-else>
                    <v-icon class="mr-3">mdi-content-copy</v-icon>
                </div>
                <slot />
            </v-btn>
        </template>
        <span>Copy to Clipboard {{ clipcontent | truncate(30) }}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: "ClipButton",
    props: {
        cls: {
            type: String,
            default: "",
        },
        clipcontent: {
            type: String,
            required: true,
        },
        badge: {
            type: String,
            default: null,
        },
    },
}
</script>
