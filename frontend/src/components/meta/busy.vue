<template>
    <component :is="layout.comp" v-bind="layout.props">
        <v-layout :fill-height="center">
            <v-row align="center" justify="center">
                <v-col cols="12">
                    <v-row justify="center">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            size="64"
                            class="my-10"
                        />
                    </v-row>
                    <v-row justify="center">
                        <slot> Loading... </slot>
                    </v-row>
                </v-col>
            </v-row>
        </v-layout>
    </component>
</template>
<script>
export default {
    props: {
        center: {
            type: Boolean,
            default: false,
        },
        overlay: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        layout() {
            if (this.overlay) {
                return {
                    comp: "v-overlay",
                    props: this.cont_props,
                }
            }
            return {
                comp: "v-layout",
                props: this.cont_props,
            }
        },
        cont_props() {
            if (this.center) {
                return {
                    style: {
                        fluid: true,
                        height: "70vh",
                    },
                }
            }
            return {}
        },
    },
}
</script>
