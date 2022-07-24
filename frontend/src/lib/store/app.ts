import { defineStore } from 'pinia'

interface IState {
    title: string
    theme: string
}

export const useAppStore = defineStore('appdata', {
    persist: true,
    state: (): IState => ({
        title: 'Welcome to TrashAI',
        theme: 'light',
    }),
    actions: {
        setTitle(title: string) {
            this.title = title
            document.title = `TrashAI - ${title}`
        },
        setTheme(theme: string) {
            this.theme = theme
        },
    },
})
