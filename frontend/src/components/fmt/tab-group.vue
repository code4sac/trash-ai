<template>
    <div>
        <v-tabs v-bind="$attrs">
            <template v-for="(obj, idx) in items">
                <v-tab
                    :key="idx + '_tab'"
                    v-bind="obj.tab_attrs || {}"
                    @change="
                        () => {
                            obj.func && obj.func()
                        }
                    "
                    :icon="obj.icon"
                >
                    {{ obj.label }}
                    <v-icon v-if="obj.icon" v-bind="obj.icon_attrs || {}">
                        {{ obj.icon }}
                    </v-icon>
                </v-tab>
                <v-tab-item :key="idx + '_tab_item'">
                    <fmt-tab-group
                        v-if="(obj.items || []).length > 0"
                        :items="obj.items"
                        v-bind="$attrs"
                    />
                    <component
                        v-if="obj.component"
                        :is="(obj.component || {}).name"
                        v-bind="(obj.component || {}).attrs"
                    >
                        {{ obj.component.content }}
                    </component>
                </v-tab-item>
            </template>
        </v-tabs>
    </div>
</template>
<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
}
</script>
