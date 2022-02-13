<!--
usage
    <fmt-titlechip
        inner="hello"
        outer="world"
        outer_color="blue"
        inner_color="warning"
    />

    <fmt-titlechip
        :inner="item.region"
        :outer="account.name"
        color_inner2="green"
    >
        <template slot="inner2">
            <resources-resourcelink :item="item" />
        </template>
-->
<template>
    <v-chip :class="couter">
        <span class="px-5">
            <slot name="outer">
                {{ outer }}
            </slot>
        </span>
        <v-chip v-if="has_inner" :class="cinner">
            <span v-if="has_inner" class="px-5">
                <slot name="inner">
                    {{ inner }}
                </slot>
            </span>
            <v-chip v-if="has_inner2" :class="cinner2">
                <span v-if="has_inner2" class="px-5">
                    <slot name="inner2">
                        {{ inner2 }}
                    </slot>
                </span>
            </v-chip>
        </v-chip>
    </v-chip>
</template>
<script>
export default {
    props: {
        inner: {
            type: String,
            default: "",
        },
        outer: {
            type: String,
            default: "",
        },
        inner2: {
            type: String,
            default: "",
        },
        color_inner: {
            type: String,
            default: "secondary",
        },
        color_inner2: {
            type: String,
            default: "accent",
        },
        color_outer: {
            type: String,
            default: "accent",
        },
    },
    data() {
        return {
            unpad: "pa-0",
        }
    },
    computed: {
        has_inner2() {
            return this.$slots.inner2 || this.inner2
        },
        has_inner() {
            return this.$slots.inner || this.inner
        },
        has_outer() {
            return this.$slots.outer || this.outer
        },
        dark_cls() {
            return this.dark_mode ? "white--text" : "black--text"
        },
        couter() {
            let cls = [this.color_outer]
            cls.push("track-outer")
            cls.push(this.unpad)
            cls.push(this.dark_cls)
            cls.push("pl-3")
            let retval = cls.join(" ")
            return retval
        },
        cinner() {
            let cls = [this.color_inner]
            cls.push("track-inner")
            cls.push(this.dark_cls)
            if (this.has_outer) {
                cls.push("pl-3")
            }
            if (this.has_inner2) {
                cls.push(this.unpad)
            }
            cls.push("ml-3")
            let retval = cls.join(" ")
            return retval
        },
        cinner2() {
            let cls = [this.color_inner2]
            cls.push("track-inner2")
            cls.push(this.dark_cls)
            cls.push(this.unpad)
            cls.push("px-1")
            cls.push("ml-3")
            let retval = cls.join(" ")
            return retval
        },
    },
}
</script>
