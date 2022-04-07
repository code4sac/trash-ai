<template>
    <div class="text-center">
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <span v-on="on" :attrs="attrs">
                    <slot />
                </span>
            </template>
            <v-list>
                <v-list-item>
                    <model-remove :item="item" />
                </v-list-item>
                <v-list-item>
                    <model-download :item="item" />
                </v-list-item>
                <v-list-item>
                    <model-meta :item="item" />
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
}
</script>
