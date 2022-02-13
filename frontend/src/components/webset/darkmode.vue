<template>
    <v-btn block @click="toggle">
        <v-icon :color="settings.color" class="mr-1">
            {{ settings.icon }}
        </v-icon>
        <v-spacer />
        {{ settings.title }}
        <v-spacer />
    </v-btn>
</template>

<script>
export default {
    computed: {
        settings() {
            if (this.dark_mode) {
                return {
                    title: "Switch to Light Mode",
                    icon: "mdi-white-balance-sunny",
                    color: "yellow",
                }
            } else {
                return {
                    title: "Switch to Dark Mode",
                    icon: "mdi-weather-night",
                    color: "grey",
                }
            }
        },
    },
    methods: {
        toggle() {
            this.dark_mode = !this.dark_mode
        },
    },
}
</script>
