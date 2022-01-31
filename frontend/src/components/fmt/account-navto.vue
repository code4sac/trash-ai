<template>
    <aws-accounts-autocomp class="ma-3" :changefunc="navto" title="Go to Account" />
</template>
<script>
export default {
    methods: {
        navto(account) {
            this.$router.push(`/aws/accounts/${account.account_id}`)
            this.$store.commit("accounts/set_selected_account", account)
        },
    },
}
</script>
