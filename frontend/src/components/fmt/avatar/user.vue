<template>
    <div>
        <v-avatar size="35" v-if="avatar_url">
            <img :src="avatar_url" />
        </v-avatar>
        <v-icon v-else>mdi-account</v-icon>
    </div>
</template>
