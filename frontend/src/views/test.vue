<template>
    <v-sheet>
        <pre>{{ JSON.stringify(env, null, 2) }}</pre>
    </v-sheet>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import * as m from '@/lib'

export default defineComponent({
    setup() {
        const appstore = m.useAppStore()
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
        this.appstore.setTitle('Test')
        const val = await m.Axios.getInstance().test()
        m.log.debug("Test Response", val.data)
        m.log.debug('mounted', import.meta.env)
    },
})
</script>
