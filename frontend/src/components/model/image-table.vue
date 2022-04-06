<template>
    <v-data-table
        v-if="uploads.length > 0"
        :headers="headers"
        :items="uploads"
        item-key="hash"
        disable-pagination
        hide-default-footer
        show-expand
        :expanded="expanded"
        @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
    >
        <template v-slot:[`item.actions`]="{ item }">
            <model-remove :item="item" />
            <model-download :item="item" />
            <model-meta :item="item" />
        </template>
        <template v-slot:[`item.thumb`]="{ item }">
            <model-thumb :item="item" />
        </template>
        <template v-slot:expanded-item="{ item }">
            <td colspan="100%" class="pa-0">
                <model-image :item="item" />
            </td>
        </template>
    </v-data-table>
</template>
<script>
export default {
    data() {
        return {
            expanded: [],
        }
    },
    computed: {
        headers() {
            return [
                {
                    text: "Actions",
                    value: "actions",
                    align: "left",
                    sortable: false,
                },
                {
                    text: "Name",
                    value: "filename",
                    align: "left",
                    sortable: false,
                },
                {
                    text: "Size",
                    value: "size",
                    align: "left",
                    sortable: false,
                },
                {
                    text: "Thumb",
                    value: "thumb",
                    align: "left",
                    sortable: false,
                },
            ]
        },
    },
}
</script>
