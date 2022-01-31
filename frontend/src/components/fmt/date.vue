<template>
    <v-tooltip z-index="1000" top>
        <template v-slot:activator="{ on }">
            <span v-on="on">
                {{ showfull ? display_time : display }}
            </span>
        </template>
        <span>{{ display_time }}</span>
    </v-tooltip>
</template>

<script>
export default {
    props: {
        time: {
            type: String,
            default: "",
        },
        timestamp: {
            type: undefined,
            default: "",
        },
        showfull: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        timeobj() {
            if (!this.time && !this.timestamp) {
                this.$error('time or timestamp is required');
                return ''
            }
            if (this.timestamp) {
                let ts = this.timestamp.toString();
                return this.$time.dayjs(_.toNumber(ts) * 1000)
            }
            return this.$time.dayjs(this.time);
        },
        display_time() {
            return this.timeobj
        },
        display() {
            return this.timeobj.fromNow();
        },
    },
};
</script>
