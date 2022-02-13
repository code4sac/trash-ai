<template>
    <div>
        <fmt-title :title="$metaInfo.title" />
        <v-btn> Plain </v-btn>
        <v-card>
            <template v-for="(color, key2) in theme">
                <div :key="key2">
                    <v-card-title :class="key2 + ' mb-3'">
                        {{ key2 }}
                    </v-card-title>
                    <v-row>
                        <v-col>
                            <template v-for="(prop, idx) in test_props">
                                <span :key="idx">
                                    <v-btn
                                        :color="key2"
                                        v-bind:[prop]="true"
                                        :key="idx"
                                    >
                                        color {{ key2 }} {{ prop }}
                                    </v-btn>
                                    <br />
                                </span>
                            </template>
                        </v-col>
                        <v-col>
                            <template v-for="(prop, idx) in test_props">
                                <span :key="idx">
                                    <v-btn
                                        :class="key2"
                                        v-bind:[prop]="true"
                                        :key="idx"
                                    >
                                        class {{ key2 }} {{ prop }}
                                    </v-btn>
                                    <br />
                                </span>
                            </template>
                        </v-col>
                    </v-row>
                </div>
            </template>
        </v-card>
    </div>
</template>

<script>
export default {
    head() {
        return {
            title: "ColorRef",
            meta: [
                {
                    name: "description",
                    content: "Reference color",
                },
            ],
        }
    },
    data() {
        return {
            tprop: "",
        }
    },
    computed: {
        test_props() {
            return [
                "depressed",
                "outlined",
                "block",
                "rounded",
                "shaped",
                "dark",
                "light",
                "plain",
                "fab",
                "x-small",
                "small",
                "large",
                "x-large",
                "tile",
            ]
        },
        theme() {
            return this.$vuetify.theme.themes.dark
        },
    },
}
</script>
