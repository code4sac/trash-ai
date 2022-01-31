<template>
    <meta-busy v-if="$fetchState.pending" />
    <div v-else>
        <fmt-title />
        <v-divider class="pa-5" />
        <v-container>
            <v-row align="center" justify="center">
                <v-col md="4" align-self="center">
                    <v-autocomplete
                        v-model="filter_tags"
                        :items="tags"
                        clearable
                        prepend-icon="mdi-filter"
                        multiple
                        label="Filter tags"
                    />
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col md="4" align-self="center">
                    <v-input>
                        <v-text-field
                            v-model="filter"
                            label="Filter String"
                            clearable
                            prepend-icon="mdi-card-search"
                        />
                    </v-input>
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-divider class="pa-5" />
                <div v-if="!awaiting_filter" style="width: 100%">
                    <v-row align="center" justify="center">
                        <template v-for="icon in filtered_dataset">
                            <v-col :key="icon.name" cols="3">
                                <v-tooltip z-index="1000" top>
                                    <popup-code
                                        :kid="icon.id"
                                        :title="`mdi-${icon.name}`"
                                        :copy="JSON.stringify(icon, null, 4)"
                                    />
                                    <template v-slot:activator="{ on }">
                                        <v-card>
                                            <v-btn
                                                v-on="on"
                                                @click="doclick(icon)"
                                            >
                                                <v-icon x-large>
                                                    {{ `mdi-${icon.name}` }}
                                                </v-icon>
                                            </v-btn>
                                            {{ `mdi-${icon.name}` }}
                                        </v-card>
                                    </template>
                                    <span>
                                        {{ `mdi-${icon.name}` }}
                                    </span>
                                </v-tooltip>
                            </v-col>
                        </template>
                    </v-row>
                </div>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import _ from "lodash"
export default {
    data() {
        return {
            filter_val: "",
            show_tag: "",
            dataset: [],
            tags: [],
            filter_tags: [],
            awaiting_filter: false,
        }
    },
    computed: {
        filter: {
            get() {
                return this.filter_val
            },
            set: _.debounce(function (val) {
                this.filter_val = val
            }, 500),
        },
        filtered_dataset() {
            if (this.awaiting_filter || (!this.filter && !this.filter_tags)) {
                return []
            } else {
                let retval = []
                let working = []

                if (this.filter_tags.length !== 0) {
                    working = this.dataset.filter((icon) => {
                        let lowertags = icon.tags.map((tag) => {
                            return tag.toLowerCase()
                        })
                        if (
                            lowertags.some((tag) => {
                                return this.filter_tags.indexOf(tag) !== -1
                            })
                        ) {
                            return true
                        } else {
                            return false
                        }
                    })
                    if (!this.filter) {
                        return working
                    }
                } else {
                    working = Array.from(this.dataset)
                }

                if (this.filter) {
                    Array.from(working).filter((icon) => {
                        let match_name = icon.name
                            .toLowerCase()
                            .includes(this.filter)

                        let match_tags = icon.tags.filter((tag) => {
                            return tag.toLowerCase().includes(this.filter)
                        })

                        let match_aliases = icon.aliases.filter((alias) => {
                            return alias.toLowerCase().includes(this.filter)
                        })

                        if (
                            match_name ||
                            match_tags.length > 0 ||
                            match_aliases.length > 0
                        ) {
                            retval.push(icon)
                        }
                    })
                    return retval
                } else {
                    return []
                }
            }
        },
    },
    mounted() {
        console.log("mount-iconfilter.vue", this.filter_tags)
    },
    async fetch() {
        let storekey = "icon_filter_dataset"
        let url = `
        https://raw.githubusercontent.com/Templarian/MaterialDesign/master/meta.json
        `.trim()
        console.log("fetching icon dataset", url)
        if (window.localStorage.getItem(storekey)) {
            this.dataset = JSON.parse(window.localStorage.getItem(storekey))
            this.settags()
        } else {
            this.dataset = await this.$axios
                .get(url)
                .then((response) => {
                    if (response.status !== 200) {
                        this.$error(
                            "Looks like there was a problem. Status Code: " +
                                response.status
                        )
                        return []
                    }
                    return response
                })
                .then(function (data) {
                    console.log("fetched icon dataset", data.data)
                    return data.data
                })
                .catch((err) => {
                    this.$error(err)
                })
            this.settags()
        }
    },
    methods: {
        doclick(icon) {
            this.$clippy(`mdi-${icon.name}`)
            this.$nuxt.$emit("open" + icon.id)
        },
        settags() {
            this.tags = []
            for (let i = 0; i < this.dataset.length; i++) {
                let icon = this.dataset[i]
                icon.tags.map((tag) => {
                    let tval = tag.toLowerCase()
                    if (this.tags.indexOf(tval) === -1) {
                        this.tags.push(tval)
                    }
                })
            }
            this.tags.sort()
        },
    },
}
</script>
