<template>
    <span class="ml-4">
        <v-row>
            <model-btn-upload />
        </v-row>
        <v-row>
            <model-clear v-if="has_uploads" />
        </v-row>
        <v-row>
            <model-download-all v-if="has_uploads" />
        </v-row>
    </span>
</template>
