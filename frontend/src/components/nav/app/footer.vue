<template>
    <v-footer app>
        <v-row align="center" justify="start">
        Logo There
        </v-row>
        <div v-if="is_dev">
            <v-icon class="ml-5">
                {{ is_mobile ? "mdi-tablet-android" : "mdi-desktop-classic" }}
            </v-icon>
        </div>
    </v-footer>
</template>
