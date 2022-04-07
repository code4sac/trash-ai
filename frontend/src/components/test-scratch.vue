<template>
    <v-container class="pa-10">
        <v-btn color="error" @click="test('$error')">Test Error</v-btn>
        <v-btn color="info" @click="test('$info')">Test Info</v-btn>
        <v-btn color="success" @click="test('$success')">Test Success</v-btn>
        <v-btn color="warning" @click="test('$warn')">Test Warning</v-btn>
    </v-container>
</template>
<script>
export default {
    methods: {
        test(type) {
            this[type](`${type} message`);
        },
    },
}
</script>
