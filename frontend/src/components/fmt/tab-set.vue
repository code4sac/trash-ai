<template>
    <div>
        <v-banner sticky>
            <v-toolbar>
                <v-tabs
                    v-if="!is_mobile"
                    :value="current_tab"
                    @change="set_tab"
                >
                    <v-tab
                        v-for="(tab, index) in tabs"
                        :key="'tab' + index"
                        :href="`#${tab.name}`"
                    >
                        <v-icon left> {{ tab.icon }} </v-icon>
                        <span>
                            {{ tab.title }}
                        </span>
                    </v-tab>
                </v-tabs>
                <v-menu v-else>
                    <template v-slot:activator="{ on }">
                        <v-row :class="`${color} text-center`">
                            <v-btn class="transparent" icon block v-on="on">
                                <v-spacer />
                                <span :class="text_class">
                                    {{ tabdict[current_tab] }}
                                </span>
                                <v-spacer />
                                <v-icon :class="text_class">
                                    mdi-dots-vertical
                                </v-icon>
                            </v-btn>
                        </v-row>
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="(tab, index) in tabs"
                            :key="index"
                            @click="set_tab(tab.name)"
                        >
                            <v-list-item-title>
                                {{ tab.title }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar>
        </v-banner>
        <v-tabs-items :value="current_tab">
            <v-card
                :class="overflow ? 'overflow-y-auto' : null + ' pa-0'"
            >
                <slot />
            </v-card>
        </v-tabs-items>
    </div>
</template>

<script>
export default {
    props: {
        tabs: {
            type: Array,
            required: true,
        },
        default_tab: {
            type: String,
            required: true,
        },
        tab_id: {
            type: String,
            required: true,
        },
        overflow: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            id: Math.random().toString(36),
            nopad: {
                'padding-top': "0px",
                'padding-bottom': "0px",
                'padding-left': "0px",
                'padding-right': "0px",
            },
        }
    },
    computed: {
        current_tab() {
            const store = this.$store.state.tabs.tabs[this.tab_id]
            if (!store) {
                return this.default_tab
            } else {
                return store
            }
        },
        color() {
            return this.dark_mode ? "white" : "black"
        },
        text_class() {
            return this.dark_mode ? "black--text" : "white--text"
        },
        tabdict() {
            let retval = {}
            for (let tab of this.tabs) {
                retval[tab.name] = tab.title
            }
            return retval
        },
    },
    methods: {
        set_tab(tab) {
            this.$store.dispatch("tabs/set", {
                key: this.tab_id,
                value: tab,
            })
        },
    },
}
</script>

<style scoped>
.v-banner >>> .v-banner__wrapper {
    padding: 0px;
}
</style>
