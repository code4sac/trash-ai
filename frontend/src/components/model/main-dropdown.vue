<template>
    <div class="text-center">
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn block class="primary" v-on="on" :attrs="attrs">
                    <v-icon> mdi-menu </v-icon>
                    Menu
                </v-btn>
            </template>
            <v-list>
                <v-list-item>
                    <model-btn-upload />
                </v-list-item>
                <v-list-item>
                    <model-clear v-if="has_uploads" />
                </v-list-item>
                <v-list-item>
                    <model-download-all v-if="has_uploads" />
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
