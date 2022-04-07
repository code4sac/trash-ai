<template>
    <v-app-bar app rounded dense elevation="2">
        <v-row
            id="app-bar-1"
            align="center"
            @click="$route.path !== '/' && $router.push('/')"
        >
            <h2 class="ml-2 pa-2">
                <v-icon> mdi-delete-variant </v-icon>
                Trash AI
            </h2>
        </v-row>
        <v-spacer />
        <v-tooltip z-index="1000" bottom>
            <template v-slot:activator="{ on: tt }">
                <v-btn
                    v-on="tt"
                    icon
                    href="https://codeforsacramento.org/"
                    target="_blank"
                >
                    <icon-code4sac />
                </v-btn>
            </template>
            <span>
                <v-row>
                    <icon-code4sac class="mr-3" />
                    Code 4 Sacramento Homepage
                </v-row>
            </span>
        </v-tooltip>
        <v-tooltip z-index="1000" bottom>
            <template v-slot:activator="{ on: tt }">
                <v-btn
                    v-on="tt"
                    icon
                    href="https://github.com/code4sac/trash-ai"
                    target="_blank"
                >
                    <v-icon>mdi-github</v-icon>
                </v-btn>
            </template>
            <span>
                <v-icon>mdi-github</v-icon>
                GitHub https://github.com/code4sac/trash-ai
            </span>
        </v-tooltip>
        <v-divider class="mx-2" vertical />
        <v-tooltip z-index="1000" bottom>
            <template v-slot:activator="{ on: tt }">
                <span v-on="tt">
                    <webset-browser />
                </span>
            </template>
            <span>
                <v-icon>mdi-information</v-icon>
                Web Settings
            </span>
        </v-tooltip>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            icon_space: 1,
            user_link: false,
            user_selected_item: 1,
        }
    },
}
</script>
