<!--
Example usage
template
    <v-form ref="form">
        <popup-ref save cancel :ref="id">
            <v-card-text>
                <v-text-field
                    v-model="item.description"
                    label="Description"
                    :rules="[(v) => !!v || 'Description is required']"
                />
                <v-text-field
                    v-model="item.value"
                    label="Value"
                    :rules="[(v) => !!v || 'Value is required']"
                />
            </v-card-text>
        </popup-ref>
    </v-form>

handler
    methods: {
        open(title, item) {
            if (!item) {
                this.item = {
                    idx: -1,
                    description: "",
                    value: "",
                }
            } else {
                this.item = JSON.parse(JSON.stringify(item))
            }
            this.$refs[this.id].valid = this.$refs.form.validate
            this.$refs[this.id].open(title).then((res) => {
                if (res) {
                    console.log("save", res, this.item);
                    this.resolve([true, this.item])
                } else {
                    console.log("cancel", res, this.item);
                    this.resolve([false, null]);
                }
            })
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
    },


parent
        editItem(item) {
            this.$refs[item.idx]
                .open(`Edit ${item.description}`, item)
                .then(([res, value]) => {
                    if (res) {
                        this.save(value)
                    }
                })
        },



-->
<template>
    <v-dialog
        v-model="active"
        transition="dialog-bottom-transition"
        :max-width="width"
    >
        <v-card :min-width="cwidth">
            <v-card-title class="secondary">
                <slot name="header-left" />
                <v-spacer />
                {{ title }}
                <v-spacer />
                <slot name="header-right" />
                <v-btn icon @click="close_cancel">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <slot />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    v-if="cancel"
                    dark
                    @click="close_cancel"
                >
                    Cancel
                </v-btn>
                <v-btn
                    v-if="save"
                    @click="close_save"
                    class="error"
                    :disabled="!valid()"
                >
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        width: {
            type: String,
            default: "500",
        },
        save: {
            type: Boolean,
            default: false,
        },
        cancel: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            active: false,
            title: "",
            resolve: null,
            reject: null,
            valid: () => {
                return true;
            },
        }
    },
    computed: {
        cwidth() {
            return this.is_mobile ? "100%" : this.width
        },
    },
    methods: {
        open(title) {
            this.title = title
            this.active = true
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        close_save() {
            this.active = false
            this.resolve(true)
        },
        close_cancel() {
            this.active = false
            this.resolve(false)
        },
    },
}
</script>
