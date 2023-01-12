<template>
    <div class="d-flex">
        <div class="mx-5 section-border">
            <v-icon class="mr-3"> mdi-image-edit </v-icon>
            <span> <b>Edit</b> </span>
            <b> Double click </b>
            on a classification label
        </div>
        <div class="mx-5 section-border">
            <v-icon class="mr-3"> mdi-new-box </v-icon>
            <span> <b>New</b> </span>
            Hold the <b>middle mouse button</b> to draw a new classification
        </div>
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Instructions',
})
</script>
<style>
.section-border {
    border: 2px solid black;
    padding: 10px;
    margin: 5px;
}
</style>
