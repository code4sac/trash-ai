<template>
    <v-tooltip z-index="1000" bottom>
        <template v-slot:activator="{ on: tt }">
            <span v-on="tt">
                <v-btn color="error" rounded @click="clear">
                    <v-icon>mdi-cancel</v-icon>
                    Clear ALL
                </v-btn>
            </span>
        </template>
        <span> Clear All </span>
    </v-tooltip>
</template>
<script>
