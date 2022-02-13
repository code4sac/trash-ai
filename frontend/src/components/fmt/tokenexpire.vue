<template>
    <div>
        <v-row>
            <v-col style="width:250px">
                {{ human_expire_left }}
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "ExpireCountdown",
    data() {
        return {
            human_expire_left: "",
        };
    },
    created() {
        setInterval(() => {
            this.human_expire_left = this.$time.get_duration(
                this.$store.state.auth.expire_left - Date.now() / 1000,
                "milliseconds",
            );
        }, 1);
    },
};
</script>
