<template>
    <span>
        <input
            type="file"
            multiple
            ref="file"
            style="display: none"
            @change="doupload($event.target.files)"
            accept="image/*"
        />
        <v-tooltip z-index="1000" bottom>
            <template v-slot:activator="{ on: tt }">
                <span v-on="tt">
                    <v-btn rounded class="primary" @click="$refs.file.click()">
                        <v-icon>mdi-upload</v-icon>
                        Upload
                    </v-btn>
                </span>
            </template>
            <span> Upload Image Files</span>
        </v-tooltip>
    </span>
</template>
