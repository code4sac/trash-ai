<template>
    <v-card
        elevation="14"
        outlined
        shaped
        width="100%"
        @mouseenter="mpause"
        @mouseleave="mresume"
    >
        <template>
            <v-dialog v-model="expand_dialog">
                <v-card max-width="500px">
                    <v-card-title> {{ item.title }}</v-card-title>

                    <v-card-text>
                        {{ item.message }}
                    </v-card-text>

                    <v-divider />
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            class="primary"
                            text
                            @click="$emit('close', 'expand_dialog')"
                        >
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="expand_code">
                <v-card max-width="500px">
                    <v-card-title> {{ item.title }}</v-card-title>

                    <v-card-text style="overflow: scroll">
                        <pre>{{
                            typeof item.code === "string"
                                ? item.code
                                : JSON.stringify(item.code, null, 4)
                        }}</pre>
                    </v-card-text>

                    <v-divider />
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            class="primary"
                            text
                            @click="$emit('close', 'expand_code')"
                        >
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        <v-progress-linear
            v-model="timer_status"
            :color="dark_mode ? 'white' : 'black'"
            striped
        />
        <v-card-title :class="item.color || 'primary'">
            <v-icon>{{ item.icon || "mdi-help" }}</v-icon>
            <v-spacer />
            {{ item.title | truncate(20) }}
            <v-spacer />
            <v-tooltip z-index="1000" top>
                <template v-slot:activator="{ on }">
                    <v-btn small text v-on="on" @click="toggle_pin">
                        <v-icon>
                            {{
                                pinned ? "mdi-motion-play" : "mdi-motion-pause"
                            }}
                        </v-icon>
                    </v-btn>
                </template>
                <span>
                    {{ pinned ? "Resume Timeout" : "Pause Timeout" }}
                </span>
            </v-tooltip>
            <v-tooltip z-index="1000" top>
                <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        small
                        @click="$nuxt.$emit('notifyremove', item.id)"
                        v-on="on"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
                <span>Close</span>
            </v-tooltip>
        </v-card-title>
        <v-card-text class="pa-3">
            <v-row class="ma-2" align="center" justify="center">
                <div v-if="message.is_t">
                    <v-btn icon small @click="$emit('open', 'expand_dialog')">
                        <v-icon>mdi-fit-to-screen</v-icon>
                    </v-btn>
                    {{ message.text }}
                    <v-icon> mdi-dots-horizontal </v-icon>
                </div>
                <div v-else>
                    {{ item.message }}
                </div>
            </v-row>
            <v-row v-if="item.code" align="center" justify="center">
                <v-divider class="ma-3" />
                <v-btn icon small block @click="$emit('open', 'expand_code')">
                    <v-icon>mdi-code-json</v-icon>
                </v-btn>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import Timer from "tiny-timer"
export default {
    props: {
        item: {
            type: Object,
            required: true,
            interval: null,
        },
    },
    data() {
        return {
            pin_state: null,
            expand_dialog: false,
            expand_code: false,
            trunc_len: 50,
            timer_status: 0,
            timer: null,
            pinned: false,
            icon_map: {
                success: "mdi-check",
                info: "mdi-information",
                warning: "mdi-alert",
                error: "mdi-alert-circle",
            },
        }
    },
    computed: {
        message() {
            const trunc = _.truncate(this.item.message, 50)
            if (trunc != this.item.message) {
                return {
                    is_t: true,
                    text: trunc,
                }
            } else {
                return {
                    is_t: false,
                    text: this.item.message,
                }
            }
        },
    },
    created() {
        let timer = new Timer()
        const timeout = this.item.timeout || 2000
        this.timer = timer
        timer.on("done", () => {
            this.$nuxt.$emit("notifyremove", this.item.id)
        })
        timer.on("tick", (ms) => {
            const perc = (ms / timeout) * 100
            this.timer_status = perc
        })
        timer.start(timeout, 100)
        this.$on("open", (ref) => {
            this.dialog_expand(ref)
        })
        this.$on("close", (ref) => {
            this.dialog_close(ref)
        })
    },
    beforeDestroy() {
        this.timer.off()
    },
    methods: {
        dialog_expand(ref) {
            this[ref] = true
            this.pin_state = Boolean(this.pinned)
            this.pinned = true
            this.timer.pause()
        },
        dialog_close(ref) {
            this[ref] = false
            this.pinned = Boolean(this.pin_state)
            if (!this.pinned) {
                this.timer.resume()
            }
        },
        mresume() {
            if (!this.pinned) {
                this.timer.resume()
            }
        },
        toggle_pin() {
            this.pinned = !this.pinned
            if (this.pinned) {
                this.timer.pause()
            } else {
                this.timer.resume()
            }
        },
        mpause() {
            if (!this.pinned) {
                this.timer.pause()
            }
        },
    },
}
</script>
