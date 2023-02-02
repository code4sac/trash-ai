<template>
    <v-overlay
        v-model="active"
        :style="ostyle"
    >
        <v-card width="300">
            <v-card-actions>
                <v-card-title>
                    {{ label ? 'Label' : 'Select a trash label' }}
                    <v-chip v-if="label">
                        {{ label ? label : 'No label' }}
                    </v-chip>
                </v-card-title>
                <v-spacer />
                <v-icon
                    @click="cancel"
                    class="pr-5"
                >
                    mdi-close
                </v-icon>
            </v-card-actions>
            <search-autocomplete
                @keyup.escape="cancel"
                @submit="submit"
                @labelchanged="labelchange"
                :initialValue="label"
            />
            <v-container>
                <v-row>
                    <v-btn
                        v-if="!rect?.correction"
                        color="red"
                        @click="remove"
                        elevation="6"
                        large
                    >
                        {{
                            rect?.is_tf
                                ? rect?.remove
                                    ? 'Is Trash'
                                    : 'Not Trash'
                                : 'Delete'
                        }}
                    </v-btn>
                    <v-btn
                        v-if="rect?.correction"
                        color="red"
                        @click="remove_correction"
                        elevation="6"
                        large
                    >
                        Remove correction
                    </v-btn>
                    <v-spacer />
                    <v-btn
                        color="green"
                        class="mr-1"
                        @click="save"
                    >
                        Save
                    </v-btn>
                </v-row>
            </v-container>
        </v-card>
    </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCanvas, DialogsEnum } from '@/lib/store'
import { DrawCanvas, Rect } from '@/lib'
import { log } from '@/lib/logging'

interface State {
    _label: string
}

export default defineComponent({
    name: 'LabelSelector',
    props: {
        draw: {
            type: DrawCanvas,
            required: true,
        },
    },
    setup() {
        const canstore = useCanvas()
        return {
            canstore,
        }
    },
    data(): State {
        return {
            _label: '',
        }
    },
    watch: {
        active: {
            handler(val) {
                if (val) {
                    log.debug('LabelSelector: active')
                } else {
                    log.debug('LabelSelector: inactive')
                }
            },
            immediate: true,
        },
    },
    computed: {
        ostyle() {
            if (!this.active) {
                return {}
            }
            let miny = this.draw.canvas!.height
            while (miny > this.draw.canvas!.clientTop + this.draw.canvas!.clientHeight) {
                miny -= 1
            }
            return {
                left: `${this.canstore.mouse.position.x}px`,
                top: `${miny}px`,
            }
        },
        rect: {
            get(): Rect | null {
                return this.canstore.active_dialog.rect
            },
            set(val: Rect | null) {
                this.canstore.set_dialog_active(DialogsEnum.action, val!)
            },
        },
        label: {
            get() {
                log.debug(this.draw)
                return this.rect?.label ?? (this._label || '')
            },
            set(val: string) {
                this.rect!.label = val
            },
        },
        active: {
            get() {
                return this.canstore.active_dialog.type === DialogsEnum.label
            },
            set(val: boolean) {
                this.canstore.set_dialog_active(
                    val ? DialogsEnum.label : DialogsEnum.none,
                    this.rect!,
                )
            },
        },
    },
    methods: {
        async submit(val: string) {
            this.label = val
            await this.save()
            this.active = false
        },
        labelchange(val: string) {
            if (this.rect?.is_tf) {
                this.rect.correction = val
            } else {
                this.label = val
            }
            this.modify(false)
        },
        modify(del: boolean) {
            const tmp = this.draw.classifications.filter(
                (rect) => rect.id !== this.rect!.id,
            )
            if (del) {
                this.draw.classifications = tmp
            } else {
                tmp.push(this.rect!)
            }
            this.draw.redraw()
        },
        async remove_correction() {
            this.rect!.correction = ''
            await this.draw.sdata?.updateRect(this.rect!)
            this.modify(false)
        },
        async remove() {
            if (this.rect?.is_tf) {
                this.rect.remove = !this.rect.remove
                await this.draw.sdata?.updateRect(this.rect)
                this.modify(false)
            } else {
                this.modify(true)
            }
            await this.save()
            this.active = false
        },
        cancel() {
            log.debug('cancel', this.rect)
            if (this.canstore.conditions().action.drawing) {
                this.modify(true)
            }
            this.active = false
        },
        async save() {
            log.debug('cancel', this.rect)
            this.modify(false)
            await this.draw.updateDb()
            this.active = false
        },
    },
})
</script>
