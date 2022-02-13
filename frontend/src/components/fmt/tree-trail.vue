<template>
    <v-breadcrumbs :dark="dark_mode" :items="bc">
        <template v-slot:divider>
            <v-icon size="25">mdi-menu-right</v-icon>
        </template>
        <template v-slot:item="{ item }">
            <v-breadcrumbs-item :item="item">
                <v-btn
                    x-large
                    text
                    class="text-none pa-0"
                    :color="item.color"
                    style="pointer-events: none"
                >
                    <v-icon size="25" class="mr-2" v-if="item.icon">
                        {{ item.icon }}
                    </v-icon>
                    <component :is="item.component" v-bind="item.attrs">
                        {{ item.text }}
                    </component>
                </v-btn>
            </v-breadcrumbs-item>
        </template>
    </v-breadcrumbs>
</template>
<script>
export default {
    props: {
        additions: {
            type: Array,
            default: [],
        },
        component: {
            type: Object,
            default: () => {},
        },
        selected: {
            type: Object,
            required: true,
        },
    },
    computed: {
        divider() {
            return " : "
        },
        bc() {
            let dat = []
            _.each(this.additions, (item) => {
                dat.push(item)
            })
            if (this.component) {
                dat.push({
                    icon: this.component.icon,
                    component: this.component.name,
                    attrs: this.component.attrs,
                })
            }
            this.selected.parents.map((p) => {
                if (!p.name) {
                    return
                }
                dat.push({
                    text: p.name,
                    icon: p.icon,
                    component: "span",
                    attrs: {
                        is: "span",
                        color: p.color,
                    },
                })
            })
            return dat
        },
    },
    mounted() {},
}
</script>
