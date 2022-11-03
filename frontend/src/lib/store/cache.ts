import { defineStore } from 'pinia'
import type { _GettersTree } from 'pinia'

interface IState {
    labels: string[]
}

interface Getters extends _GettersTree<IState> {
    trash_labels(state: IState): string[]
}

interface Actions {
    setLabels(labels: string[]): void
}

export const useCache = defineStore<'cache', IState, Getters, Actions>(
    'cache',
    {
        persist: true,
        state: () => ({
            labels: [],
        }),
        actions: {
            setLabels(labels: string[]) {
                this.labels = labels
            },
        },
        getters: {
            trash_labels: (state: IState) => state.labels,
        },
    },
)
