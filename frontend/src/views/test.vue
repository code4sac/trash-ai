<template>
    <b> The cake is a lie. {{ vardata }}  </b>
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
    data() {
        return {
            vardata: 'not initialized',
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
        const val = await m.Axios.getInstance().test()
        this.vardata = val.data.message
        m.log.debug('Test Response', val.data)
        m.log.debug('mounted', import.meta.env)

    },
})
</script>
