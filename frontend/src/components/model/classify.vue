<template>
    <v-card
        id="label-selector"
        flat
        class="border"
    >
        <v-card-text>
            <v-row
                align="center"
                justify="center"
            >
                <v-col
                    align="center"
                    justify="center"
                >
                    <v-chip
                        v-if="appstore.canvas_message"
                        class="text-center"
                        :color="appstore.canvas_message ? 'red' : 'green'"
                    >
                        {{
                            appstore.canvas_message
                                ? appstore.canvas_message
                                : 'Happy Classifying!'
                        }}
                    </v-chip>
                </v-col>
            </v-row>
            <v-row
                align="center"
                justify="center"
            >
                <LabelSelector :draw="draw" />
                <v-col class="imagecanvas">
                    <div id="canvasparent" />
                </v-col>
            </v-row>
            <v-row
                align="center"
                justify="center"
                class="help-border"
            >
                <Instructions v-if="!$vuetify.display.xs">
                    <div v-if="!is_prod">
                        <span
                            class="mx-1"
                            v-for="(group, group_name) in conditions"
                            :key="group_name"
                        >
                            <v-chip class="t pr-0">
                                <span class="mr-2">
                                    {{ group_name }}
                                </span>
                                <v-chip
                                    :class="ison ? 'on' : 'off'"
                                    v-for="(ison, name) in group"
                                    :key="name"
                                >
                                    {{ name }}
                                </v-chip>
                            </v-chip>
                        </span>
                    </div>
                </Instructions>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SaveData } from '@/lib/models'
import { DrawCanvas } from '@/lib/draw'
import { useCanvas, useAppStore } from '@/lib/store'
import Instructions from '@/components/classify_instructions.vue'

export default defineComponent({
    name: 'Classify',
    components: {
        Instructions,
    },
    props: {
        sdata: {
            type: SaveData,
            required: true,
        },
    },
    setup(props) {
        const appstore = useAppStore()
        const canstore = useCanvas()
        const draw = new DrawCanvas({
            imageSrc: props.sdata.origdataUrl!,
            sdata: props.sdata,
            is_tf: false,
        })

        return {
            canstore,
            appstore,
            draw,
        }
    },
    computed: {
        is_prod() {
            return !import.meta.env.DEV
        },
        img_id() {
            return `${this.sdata?.hash}-classify`
        },
        calcmode: {
            get() {
                return this.canstore.mode
            },
            set(val: any) {
                this.canstore.set_mode(val)
            },
        },
        conditions() {
            return this.draw.cstate?.conditions()
        },
    },
    async created() {
        await this.draw.load()
    },
    async mounted() {},
})
</script>

<style>
.canvasimage {
    position: absolute;
}

.t {
    color: white;
    background-color: black;
    align-self: center;
    text-align: center;
}

.info {
    color: white;
    background-color: blue;
    align-self: center;
    text-align: center;
}

.info-value {
    color: grey;
    background-color: white;
    align-self: center;
    text-align: center;
}

.on {
    color: white;
    background-color: green;
    align-self: center;
    text-align: center;
}
.off {
    color: white;
    background-color: red;
    align-self: center;
    text-align: center;
}

.help-border {
    border: 5px solid #ccc;
    margin: 5px;
    background-color: lightgreen;
}
</style>
