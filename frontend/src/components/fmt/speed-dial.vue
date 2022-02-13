<template>
    <v-speed-dial
        v-model="fab"
        :direction="direction"
        :transition="transition"
    >
        <template v-slot:activator>
            <v-btn v-bind="$attrs" v-model="fab">
                <v-icon v-if="fab"> mdi-close </v-icon>
                <v-icon v-else-if="open_icon">
                    {{ copen_icon }}
                </v-icon>
            </v-btn>
        </template>
        <slot>
        </slot>
    </v-speed-dial>
</template>
<script>
export default {
    props: {
        transition: {
            type: String,
            default: "slide-y-reverse-transition",
        },
        open_icon: {
            type: String,
            default: "mdi-menu-right",
        },
        direction: {
            type: String,
            default: "right",
        },
        color: {
            type: String,
            default: "primary",
        },
    },
    computed: {
        copen_icon() {
            if (this.open_icon) {
                return this.open_icon
            }
            const map = {
                right: "mdi-menu-right",
                left: "mdi-menu-left",
                up: "mdi-menu-up",
                down: "mdi-menu-down",
            }
            let retval = map[this.direction]
            if (!retval) {
                retval = "mdi-menu-right"
            }
            return retval
        },
    },
    data: () => ({
        fab: false,
    }),
}
</script>
