<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-container v-else class="pa-10">
        <v-card>
        <test-color-title color="primary" :groups="all_groups" />
        <test-color-title color="secondary" :groups="all_groups" />
        <test-color-title color="accent" :groups="all_groups" />
        <test-color-title color="accent2" :groups="all_groups" />
        </v-card>
        <template>
            <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn dark v-bind="attrs" v-on="on">
                        Show Copy / Pasta
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title> Copy Pasta </v-card-title>
                    <v-card-text>
                        <code>
                            this.$vuetify.theme.themes.{{ tkey }}.primary = "{{
                                colors["primary"]
                            }}"
                            <br />
                            this.$vuetify.theme.themes.{{ tkey }}.secondary =
                            "{{ colors["secondary"] }}"
                            <br />
                            this.$vuetify.theme.themes.{{ tkey }}.accent = "{{
                                colors["accent"]
                            }}"
                            <br />
                            this.$vuetify.theme.themes.{{ tkey }}.accent2 = "{{
                                colors["accent2"]
                            }}"
                            <br />
                            this.$vuetify.theme.themes.{{ tkey }}.error = "{{
                                colors["error"]
                            }}"
                            <br />
                            this.$vuetify.theme.themes.{{ tkey }}.success = "{{
                                colors["success"]
                            }}"
                            <br />
                            this.$vuetify.theme.themes.{{ tkey }}.warning = "{{
                                colors["warning"]
                            }}"
                            <br />
                            this.$vuetify.theme.themes.{{ tkey }}.info = "{{
                                colors["info"]
                            }}"
                            <br />
                        </code>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title> Copy Pasta JSON </v-card-title>
                    <v-card-text>
                        <pre
                            >{{ JSON.stringify(theme, null, 2) }}
                        </pre>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </template>
        <v-tabs>
            <v-tab>
                <span> Group 1 </span>
            </v-tab>
            <v-tab> Group 2 </v-tab>
            <v-tab-item>
                <v-card>
                    <v-row>
                        <v-col v-for="(key, idx) in group1" :key="idx + key">
                            <v-card>
                                <v-card-title>
                                    {{ key | title }}
                                </v-card-title>
                                <v-color-picker
                                    v-model="colors[key]"
                                    class="ma-2"
                                    show-swatches
                                    mode="hexa"
                                    dot-size="50"
                                />
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card>
                    <v-row>
                        <v-col v-for="(key, idx) in group2" :key="idx + key">
                            <v-card>
                                <v-card-title>
                                    {{ key | title }}
                                </v-card-title>
                                <v-color-picker
                                    v-model="colors[key]"
                                    class="ma-2"
                                    show-swatches
                                    mode="hexa"
                                    dot-size="50"
                                />
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-tab-item>
        </v-tabs>
        <v-chip class="warning"> hello </v-chip>
        <v-card>
            <v-card-title> :color Based Colors </v-card-title>
            <v-chip
                v-for="(key, idx) in group1"
                :key="idx + key"
                :color="colors[key]"
            >
                {{ key | title }} - {{ colors[key] }}
            </v-chip>
            <v-chip
                v-for="(key, idx) in group2"
                :key="idx + key"
                :color="colors[key]"
            >
                {{ key | title }} - {{ colors[key] }}
            </v-chip>
        </v-card>
        <v-card>
            <v-card-title> Class Based Colors </v-card-title>
            <v-chip
                v-for="(key, idx) in group1"
                :key="idx + key"
                :class="key | lower"
            >
                {{ key | title }} - {{ colors[key] }}
            </v-chip>
            <v-chip
                v-for="(key, idx) in group2"
                :key="idx + key"
                :class="key | lower"
            >
                {{ key | title }} - {{ colors[key] }}
            </v-chip>
        </v-card>
        <v-card :key="page_key">
            <v-card-title class="accent2"> Accent 2 </v-card-title>
            <TagsList expandable />
            <AwsAccountsList expandable />
        </v-card>
    </v-container>
</template>
<script>
export default {
    layout: "innertab",
    head() {
        return {
            title: this.title,
        }
    },
    data() {
        return {
            title: "Color Chooser",
            dialog: false,
            colors: {},
        }
    },
    async fetch() {
        return new Promise((resolve, _reject) => {
            this.save_existing()
            this.colors = Object.assign({}, this.defaults)
            resolve()
        })
    },
    computed: {
        theme() {
            return {
                theme: {
                    themes: {
                        [this.tkey]: this.colors,
                    },
                },
            }
        },
        group1() {
            return ["primary", "secondary", "accent", "accent2"]
        },
        group2() {
            return ["error", "success", "warning", "info"]
        },
        all_groups() {
            return [...this.group1, ...this.group2]
        },
        tkey() {
            return this.dark_mode ? "dark" : "light"
        },
        page_key() {
            return this.$md5.obj(this.cdata)
        },
    },
    watch: {
        colors: {
            async handler(val) {
                console.log("watch", val)
                this.$vuetify.theme.themes[this.tkey].primary = val.primary
                this.$vuetify.theme.themes[this.tkey].secondary = val.secondary
                this.$vuetify.theme.themes[this.tkey].accent = val.accent
                this.$vuetify.theme.themes[this.tkey].accent2 = val["accent2"]

                this.$vuetify.theme.themes[this.tkey].success = val.success
                this.$vuetify.theme.themes[this.tkey].error = val.error
                this.$vuetify.theme.themes[this.tkey].warning = val.warning
                this.$vuetify.theme.themes[this.tkey].info = val.info
            },
            deep: true,
        },
    },
    methods: {
        save_existing() {
            this.defaults = {
                primary: this.$vuetify.theme.themes[this.tkey].primary,
                secondary: this.$vuetify.theme.themes[this.tkey].secondary,
                accent: this.$vuetify.theme.themes[this.tkey].accent,
                accent2: this.$vuetify.theme.themes[this.tkey]["accent2"],

                success: this.$vuetify.theme.themes[this.tkey].success,
                error: this.$vuetify.theme.themes[this.tkey].error,
                warning: this.$vuetify.theme.themes[this.tkey].warning,
                info: this.$vuetify.theme.themes[this.tkey].info,
            }
        },
    },
}
</script>
