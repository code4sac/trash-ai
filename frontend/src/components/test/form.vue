<template>
    <v-dialog v-model="dialog" :fullscreen="maximize" width="500">
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" fab rounded small class="primary">
                <v-icon>{{
                    item.key ? "mdi-pencil" : "mdi-plus"
                }}</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                {{ item.key
                     ? "Edit"
                     : "New Entry"
                 }}
                <v-spacer />
                <v-btn icon @click="maximize = !maximize">
                    <v-icon v-if="!maximize">mdi-fullscreen</v-icon>
                    <v-icon v-else>mdi-fullscreen-exit</v-icon>
                </v-btn>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="mt-3">
                <v-form v-model="valid" ref="form">
                    <v-text-field
                        v-model="item.form.text"
                        :rules="[(v) => !!v || 'Text is required']"
                        label="Text"
                        required
                    />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="error" v-if="item.key" @click="do_delete">
                    Delete
                </v-btn>
                <v-btn color="warning" @click="dialog = false">
                    Cancel
                </v-btn>
                <v-btn v-if="valid" color="primary" @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => ({
                "form": {
                    "text": "",
                },
            })
        },
    },
    data() {
        return {
            dialog: false,
            maximize: false,
            valid: false,
        }
    },
    methods: {
        do_delete() {
            this.dialog = false
            console.log("delete child", this.item)
            this.$emit("do_delete", this.item)
        },
        save() {
            this.$refs.form.validate()
            if (this.valid) {
                this.dialog = false
                console.log("save child", this.item)
                this.$emit("save", this.item)
            }
        },
    },
}
</script>
