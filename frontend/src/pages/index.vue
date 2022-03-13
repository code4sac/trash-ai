<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-card v-else v-bind="outerProps">
        <v-card-title class="accent2 pl-0 py-0">
            <fmt-tree-trail
                class="ml-3"
                :selected="selected"
                :additions="title_additions"
            />
            <v-spacer />
            <fmt-btn-refresh />
        </v-card-title>
        <v-row class="mt-5">
            <v-col v-bind="col1">
                <component :is="bannerComp" v-bind="bannerProp">
                    <v-treeview
                        :active.sync="active"
                        :open.sync="open_vals"
                        :items="data.children"
                        activatable
                        item-key="id"
                        ref="indextreeview"
                        open-on-click
                    >
                        <template v-slot:prepend="{ item }">
                            <v-icon>
                                {{ item.icon }}
                            </v-icon>
                        </template>
                        <template v-slot:label="{ item }">
                            <v-tooltip v-if="item.help" z-index="1000" top>
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">
                                        {{ item.name }}
                                    </span>
                                </template>
                                <span v-html="item.help" />
                            </v-tooltip>
                            <span v-else>{{ item.name }}</span>
                        </template>
                    </v-treeview>
                </component>
            </v-col>
            <v-col v-bind="col2">
                <div v-bind="innerprops" :ref="selected.id">
                    <component
                        :is="selected.component"
                        v-bind="selected.attrs"
                    >
                        {{ selected.content }}
                    </component>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
const uid = () => Math.random().toString(34)

export default {
    layout: "innertab",
    data() {
        return {
            selected: {
                parents: [],
            },
            stub_active: [],
            data: {},
            open_vals: [],
            default_id: uid(),
        }
    },
    computed: {
        tabs_attrs() {
            return {
                grow: true,
            }
        },
        tab_class() {
            return "mtab text-none"
        },
        tabs_attrs() {
            return {
                "active-class": "mtab-active",
                "background-color": "accent2",
                "slider-color": "primary",
                grow: true,
            }
        },
        navto() {
            return this.is_mobile
        },
        title_additions() {
            return []
        },
        col1() {
            if (this.is_mobile) {
                return {
                    cols: "12",
                }
            }
            return {
                cols: "3",
            }
        },
        col2() {
            if (this.is_mobile) {
                return {
                    cols: "12",
                }
            }
            return {
                cols: "9",
            }
        },
        outerProps() {
            if (this.is_mobile) {
                return {
                    width: this.$vuetify.breakpoint.width - 20,
                    height: this.cheight,
                    class: this.outerclass,
                }
            }
            return {
                width: this.$el.scrollWidth,
                height: this.cheight,
                class: this.outerclass,
            }
        },
        bannerComp() {
            return this.is_mobile ? "v-banner" : "v-treeview"
        },
        bannerProp() {
            return this.is_mobile
                ? {
                      sticky: true,
                  }
                : {}
        },
        cheight() {
            return this.height ? this.height : "100%"
        },
        outerclass() {
            if (this.height) {
                return _.join(["overflow-y-auto", "overflow-x-hidden"], " ")
            }
            return ""
        },
        innerprops() {
            let vif = !_.isEmpty(this.selected)
            let key = this.selected.id
            return {
                "v-if": vif,
                key: key,
            }
        },
        active: {
            get() {
                if (this.stub_active.length > 0) {
                    return this.stub_active
                }
                return []
            },
            set(val) {
                this.get_selected(val, this.data)
                this.$emit("update:selected", this.selected)
                this.stub_active = val
            },
        },
    },
    methods: {
        find_id(id, child) {
            if (child.id == id) {
                return child
            }
            let retval = null
            _.each(child.children || [], (item) => {
                retval = this.find_id(id, item)
                if (retval) {
                    return false
                }
            })
            return retval
        },
        get_selected(val, child) {
            if (!child.parents) {
                child.parents = []
            }
            if (child.id == val) {
                child.parents.push(child)
                this.selected = child
            }
            _.each(child.children || [], (item) => {
                item.parents = child.parents.slice()
                item.parents.push(child)
                this.get_selected(val, item)
            })
        },
        get_initial_data() {
            return {
                children: [
                    {
                        id: this.default_id,
                        name: "Upload",
                        icon: "mdi-upload",
                        component: "model-upload",
                        attrs: {},
                    },
                    {
                        id: uid(),
                        name: "Lab",
                        icon: "mdi-test-tube",
                        children: [
                            {
                                id: uid(),
                                name: "Icons",
                                icon: "mdi-image",
                                component: "test-iconfilter",
                                attrs: {},
                            },
                            {
                                id: uid(),
                                name: "Color Chooser",
                                icon: "mdi-palette",
                                component: "test-colorchooser",
                                attrs: {},
                            },
                            {
                                id: uid(),
                                name: "Scratch Page",
                                icon: "mdi-ab-testing",
                                component: "test-scratch",
                                attrs: {},
                            },
                        ],
                    },
                ],
            }
        },
    },
    watch: {
        selected: {
            async handler(val) {
                console.log("selected", val)
                this.page_title = val.name
                if (val.func) {
                    val.func()
                }
            },
        },
    },
    head() {
        return {
            title: this.page_title,
            meta: [
                {
                    name: "description",
                    content: "Home page",
                },
            ],
        }
    },
    async fetch() {
        return new Promise((resolve, _reject) => {
            this.$nuxt.$on("title", (title) => {
                this.title = title
            })
            this.data = this.get_initial_data()
            this.active = [this.default_id]
            this.get_ref("indextreeview").then((treeview) => {
                console.log("treeview", treeview)
                treeview.updateAll(true)
            })
            resolve()
        })
    },
}
</script>
