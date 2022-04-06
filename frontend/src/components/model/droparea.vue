<template>
    <v-card v-if="$fetchState.pending">
    <v-card-title>Loading Model...</v-card-title>
    <meta-busy />
    </v-card>
    <v-card
    v-else
        id="droparea"
        ref="droparea"
        min-height="500"
        v-cloak
        @drop.prevent="doupload($event.dataTransfer.files)"
        @dragover.prevent
        outlined
        raised
        class="withborder accent2"
    >
        <v-card-title>
            <model-btn-upload v-if="!has_uploads" />
            <ModelMainDropdown v-else />
            <v-spacer />
            <span v-if="!is_mobile"> Drag and Drop Images Here </span>
            <v-spacer />
            <v-icon x-large>mdi-file-image-plus</v-icon>
        </v-card-title>
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    async fetch() {
        console.log("waiting for model...")
        await this.getTfInfo()
    },
};
</script>
