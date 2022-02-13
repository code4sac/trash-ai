<template>
    <v-card-title :class="color">
        <v-row>
            <v-col> {{ color }} </v-col>
            <template v-for="(tcolor, index) in groups">
                <v-col :key="tcolor + index + 'btn'">
                    <v-btn :text="color === tcolor" :class="tcolor">
                        <v-icon v-if="color !== tcolor">mdi-plus</v-icon>
                    </v-btn>
                </v-col>
            </template>
        </v-row>
    </v-card-title>
</template>
<script>
export default {
    props: {
        color: {
            type: String,
            required: true,
        },
        groups: {
            type: Array,
            required: true,
        },
    },
}
</script>
