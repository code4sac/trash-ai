<template>
    <div>
        <span v-for="item in uploads" :key="item.hash">
            <v-card-title class="accent2">
                <ModelDial :item="item" v-if="is_mobile" />
                <span v-else>
                    <model-remove :item="item" />
                    <model-download :item="item" />
                    <model-meta :item="item" />
                </span>
                <v-spacer />
                <ModelFilename :item="item" />
                <ModelStatusUpload :item="item" />
                <ModelStatusNew :item="item" />
                <ModelFilesize :item="item" />
            </v-card-title>
            <v-card-title>
                <model-image :item="item" />
            </v-card-title>
        </span>
    </div>
</template>
