<template>
    <v-data-table
        :headers="headers_staged"
        :items="inprogress"
        item-key="hash"
        disable-pagination
        hide-default-footer
    >
        <template v-slot:[`item.progress`]="{}">
            <v-progress-linear color="primary" height="4" indeterminate />
        </template>
    </v-data-table>
</template>
<script>
export default {
    computed: {
        headers_staged() {
            return [
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
                    text: "Progress",
                    value: "progress",
                    align: "left",
                    sortable: false,
                },
            ]
        },
    },
}
</script>
