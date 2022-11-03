<template>
    <b> The cake is a lie. </b>
    <SelectLabel />
    <div class="rectangle">
        <v-card height="100vh">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
        </v-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useAppStore } from '@/lib/store'
import { log } from '@/lib/logging'

export default defineComponent({
    setup() {
        const appstore = useAppStore()
        return {
            appstore,
        }
    },
    computed: {
        env() {
            return import.meta.env
        },
    },
    async mounted() {
        log.info('test mounted')
        this.appstore.setTitle('Test')
        /* const val = await m.Axios.getInstance().test() */
        /* m.log.debug('Test Response', val.data) */
        /* m.log.debug('mounted', import.meta.env) */
    },
})
</script>
