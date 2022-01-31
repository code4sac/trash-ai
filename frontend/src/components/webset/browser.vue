<template>
    <div>
        <v-menu auto>
            <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on">
                    <v-icon>
                        mdi-application-cog-outline
                    </v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item>
                    <webset-darkmode />
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
