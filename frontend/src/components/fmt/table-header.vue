<template>
    <div>
        <v-card class="my-5">
            <slot name="preheader" />
            <v-card-title
                v-if="!noheader && (newcallback || newto || filename)"
                class="secondary"
            >
                <slot name="newbutton">
                    <v-btn
                        v-if="newto"
                        rounded
                        fab
                        small
                        class="primary"
                        :to="newto"
                    >
                        <v-icon> mdi-plus </v-icon>
                    </v-btn>
                    <v-btn
                        v-else-if="newcallback"
                        rounded
                        fab
                        small
                        @click="newcallback"
                        class="primary"
                    >
                        <v-icon> mdi-plus </v-icon>
                    </v-btn>
                </slot>
                <v-spacer v-if="newto || $slots.newbutton" />
                <slot name="title">
                    {{ title }}
                </slot>
                <v-spacer v-if="filename" />
                <fmt-download-json
                    v-if="filename"
                    :data="list"
                    :filename="filename"
                />
                <FmtBtnRefresh class="mr-3" v-if="refresh" />
            </v-card-title>

            <v-card-title class="accent">
                <v-text-field
                    v-if="!disable_filter"
                    v-model="filter_upd"
                    class="mx-4 mt-4"
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                    clearable
                />
                <v-spacer v-if="$slots.header" />
                <slot name="header" />
                <v-spacer />
                <v-select
                    label="Show / Hide Columns"
                    small-chips
                    prepend-icon="mdi-filter-variant"
                    hint="Filter Columns"
                    v-if="headers.length > 0"
                    v-model="dfilter_headers"
                    chips
                    deletable-chips
                    hide-selected
                    multiple
                    :items="headers"
                />
                <v-spacer v-if="headers.length > 0" />
            </v-card-title>
            <v-card-text v-if="$slots.default">
                <slot />
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
export default {
    props: {
        newto: {
            type: String,
            default: null,
        },
        newcallback: {
            type: Function,
            default: null,
        },
        title: {
            type: String,
            default: null,
        },
        filename: {
            type: String,
            default: null, // no need for .json extension
        },
        list: {
            type: Array,
            default: () => [],
        },
        filter: {
            type: String,
            default: "",
        },
        filter_headers: {
            type: Array,
            default: () => [],
        },
        disable_filter: {
            type: Boolean,
            default: false,
        },
        headers: {
            type: Array,
            default: () => [],
        },
        refresh: {
            type: Boolean,
            default: false,
        },
        noheader: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dfilter: "",
            dfheaders: [],
        }
    },
    computed: {
        dfilter_headers: {
            get() {
                return this.dfheaders
            },
            set(val) {
                this.dfheaders = val
                this.$emit("update:filter_headers", val)
            },
        },
        filter_upd: {
            get() {
                return this.dfilter
            },
            set(val) {
                this.dfilter = val
                this.$emit("update:filter", val)
            },
        },
    },
    created() {
        this.dfilter = this.filter
        this.dfheaders = this.filter_headers
    },
}
</script>
