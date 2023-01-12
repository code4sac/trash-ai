<template>
    <v-container>
        <v-row>
            <v-chip v-if="searchLabels.length">
                Showing {{ searchLabels.length }} of {{ labels.length }} results
            </v-chip>
        </v-row>
        <v-row>
            <v-text-field
                id="search"
                v-model="searchTerm"
                label="Search"
                placeholder="Type here..."
                class="my-5"
                clearable
                @keyup.left="prev"
                @keyup.right="next"
                @keyup.enter="submit"
            />
        </v-row>
        <v-row>
            <v-chip
                v-for="label in searchLabels"
                :key="label"
                @click="selectLabel(label)"
                :class="label === selectedLabel ? 'selected' : 'other'"
            >
                {{ label }}
            </v-chip>
        </v-row>
        <!-- 
        <v-row>
            <v-select
                v-model="selectedLabel"
                :items="labels"
                label="Label"
                clearable
                class="my-5"
            />
        </v-row>
        -->
    </v-container>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import { useCache } from '@/lib/store'
import Fuse from 'fuse.js'
import { log } from '@/lib/logging'

export default defineComponent({
    name: 'SearchAutocomplete',
    setup(props) {
        const max_score = 0.5
        let term = ref('')
        const labels = useCache().trash_labels
        const selectLabel = (label: string) => {
            selectedLabel.value = label
            term.value = ''
        }
        const searchLabels = computed(() => {
            if (term.value === '') {
                return []
            }
            const fuse = new Fuse(labels, {
                includeScore: true,
                shouldSort: true,
                threshold: max_score,
                ignoreFieldNorm: true,
            })
            const results = fuse.search(term.value)
            log.debug('results', results)
            if (results.length === 0) {
                return []
            }
            if (results.length === 1) {
                selectLabel(results[0].item)
                return []
            }
            if (results.length > 10) {
                return results.slice(0, 10).map((r) => r.item)
            }
            return results.map((r) => r.item)
            /*  */
            /*  */
            /* const retval = labels.filter((label) => { */
            /*     log.debug(label, fuzzyWeight(label)) */
            /*     if ( */
            /*         label.toLowerCase().includes(term.value.toLowerCase()) && */
            /*         matches < 10 */
            /*     ) { */
            /*         matches++ */
            /*         return label */
            /*     } */
            /* }) */
            /*  */
        })

        let selectedLabel = ref(props.initialValue)

        return {
            labels: labels,
            searchTerm: term,
            searchLabels: searchLabels,
            selectLabel: selectLabel,
            selectedLabel: selectedLabel,
        }
    },
    props: {
        initialValue: {
            type: String,
            default: '',
        },
    },
    mounted() {
        document.getElementById('search')?.focus()
    },
    methods: {
        submit() {
            log.debug('submit', this.selectedLabel)
            this.$emit('submit', this.selectedLabel)
        },
        slide(direction: 'up' | 'down') {
            const idx = this.searchLabels.indexOf(this.selectedLabel)
            if (idx === -1) {
                this.selectedLabel = this.searchLabels[0]
            } else {
                switch (direction) {
                    case 'up':
                        if (idx === 0) {
                            this.selectedLabel =
                                this.searchLabels[this.searchLabels.length - 1]
                        } else {
                            this.selectedLabel = this.searchLabels[idx - 1]
                        }
                        break
                    case 'down':
                        if (idx === this.searchLabels.length - 1) {
                            this.selectedLabel = this.searchLabels[0]
                        } else {
                            this.selectedLabel = this.searchLabels[idx + 1]
                        }
                        break
                }
            }
        },
        next() {
            this.slide('down')
        },
        prev() {
            this.slide('up')
        },
    },
    watch: {
        selectedLabel(newVal) {
            this.$emit('labelchanged', newVal)
        },
    },
})
</script>

<style>
.selected {
    background-color: red;
    color: white;
}

.other {
    background-color: lightgray;
    color: black;
}
</style>
