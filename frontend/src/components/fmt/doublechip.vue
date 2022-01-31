<template>
    <v-chip :class="`${outer_color} mx-0 pa-0`" v-bind="$attrs" small>
        <v-icon v-if="!_.isEmpty(close)" color="black" @click="do_close">
            mdi-close-circle
        </v-icon>
        <v-chip
            v-bind="$attrs"
            small
            :class="`${outer_color} ${outer_class} px-1`"
        >
            <slot name="outer">
                {{ outer_value }}
            </slot>
        </v-chip>
        <v-chip v-bind="$attrs" :class="`${inner_color} ${inner_class} px-2`">
            <slot name="inner">
                {{ inner_value }}
            </slot>
        </v-chip>
    </v-chip>
</template>
<script>
export default {
    props: {
        inner_value: {
            type: String,
            default: "",
        },
        outer_value: {
            type: String,
            default: "",
        },
        inner_color: {
            type: String,
            default: "",
        },
        outer_color: {
            type: String,
            default: "",
        },
        inner_class: {
            type: String,
            default: "",
        },
        outer_class: {
            type: String,
            default: "",
        },
        close: {
            type: Object,
            default: null,
        },
    },
    mounted() {
        let skip_init = false
        const has_inners =
            (!_.isEmpty(this.inner_value) && !_.isEmpty(this.inner_color)) ||
            this.$slots.inner
        const has_outers =
            (!_.isEmpty(this.outer_value) && !_.isEmpty(this.outer_color)) ||
            this.$slots.outer

        if (!has_inners) {
            this.$error("DoubleChip inner is required")
            skip_init = true
        }
        if (!has_outers) {
            this.$error("DoubleChip outer is required")
            skip_init = true
        }
        if (skip_init) {
            return
        }
    },
    methods: {
        do_close() {
            if (!this.close.callback) {
                this.$error("no callback defined")
                return
            }
            this.close.callback()
        },
    },
}
</script>
