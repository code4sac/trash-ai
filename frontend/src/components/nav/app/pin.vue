<template>
    <div>
        <v-tooltip v-if="!dark_mode" bottom>
            <template v-slot:activator="{ on }">
                <v-btn small v-on="on" @click="toggle">
                    <v-icon class="mr-1"> mdi-weather-night </v-icon>
                    {{ title }}
                </v-btn>
            </template>
            <span>Switch to Dark Mode</span>
        </v-tooltip>

        <v-tooltip v-else bottom>
            <template v-slot:activator="{ on }">
                <v-btn small v-on="on" @click="toggle">
                    <v-icon color="yellow"> mdi-white-balance-sunny </v-icon>
                    {{ title }}
                </v-btn>
            </template>
            <span>Switch to Light Mode</span>
        </v-tooltip>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
    },
    methods: {
        toggle() {
            this.dark_mode = !this.dark_mode;
        },
    },
};
</script>
