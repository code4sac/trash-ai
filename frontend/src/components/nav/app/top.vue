<template>
    <v-app-bar app rounded dense elevation="2">
        <v-row
            id="app-bar-1"
            align="center"
            @click="$route.path !== '/' && $router.push('/')"
        >
            <h2 v-if="!is_mobile" class="ml-2 pa-2">
                <v-icon> mdi-delete-variant </v-icon>
                Trash AI
            </h2>
        </v-row>
        <v-spacer />
        <webset-browser />
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
