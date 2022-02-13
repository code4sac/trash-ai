<template>
    <v-btn block @click="toggle">
        <v-icon class="mr-1"> {{ settings.icon }} </v-icon>
        <v-spacer />
        {{ settings.title }}
        <v-spacer />
    </v-btn>
</template>

<script>
export default {
    computed: {
        settings() {
            if (this.is_left) {
                return {
                    title: "Move Sidebar Right",
                    icon: "mdi-arrow-right",
                };
            } else {
                return {
                    title: "Move Sidebar Left",
                    icon: "mdi-arrow-left",
                };
            }
        },
    },
    methods: {
        toggle() {
            this.is_left = !this.is_left;
            this.$store.dispatch("web_settings/save");
        },
    },
};
</script>
