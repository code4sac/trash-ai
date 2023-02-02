import { defineStore } from 'pinia'
import { Extract, Rect } from '@/lib'
import type { _GettersTree } from 'pinia'

interface IState {
    title: string
    theme: string
    action_mode: number
    canvas_message: string
    highlight_image: HighLightImage
}

interface Actions {
    setCanvasMessage(message: string): void
    setHighLightImage(x: number, y:number, image: Extract | null, rect: Rect | null): void
    setTheme(theme: string): void
    setActionMode(mode: number): void
    setTitle(title: string): void
}

interface HighLightImage {
    x: number
    y: number
    img: Extract | null
    rect: Rect | null
}

interface Getters extends _GettersTree<IState> {}

export const useAppStore = defineStore<'appdata', IState, Getters, Actions>(
    'appdata',
    {
        persist: true,
        state: (): IState => ({
            title: 'Welcome to TrashAI',
            theme: 'light',
            action_mode: 0,
            highlight_image: {
                x: 0,
                y: 0,
                img: null,
                rect: null,
            },
            canvas_message: '',
        }),
        actions: {
            setHighLightImage(x: number, y: number, image: Extract | null, rect: Rect | null): void {
                this.highlight_image = {
                    x: x,
                    y: y,
                    img: image,
                    rect: rect,
                }
            },
            setCanvasMessage(message: string) {
                this.canvas_message = message
            },
            setTitle(title: string) {
                this.title = title
                document.title = `TrashAI - ${title}`
            },
            setTheme(theme: string) {
                this.theme = theme
            },
            setActionMode(mode: number) {
                this.action_mode = mode
            },
        },
    },
)
