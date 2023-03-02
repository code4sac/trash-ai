import { defineStore } from 'pinia'
import { Rect } from '@/lib/draw'
import type { _GettersTree } from 'pinia'

export enum DialogsEnum {
    none = 'none',
    action = 'action',
    label = 'label',
}

enum MouseHeldState {
    none,
    active,
}

enum MouseMovingState {
    none,
    active,
}

enum MouseHoverState {
    none,
    active,
}

enum MouseButton {
    left,
    middle,
    right,
    none = -1,
}

enum ObjectActionState {
    none = 'none',
    drawing = 'drawing',
    resizing = 'resizing',
    moving = 'moving',
}

enum Mode {
    none = 'none',
    draw = 'draw',
    select = 'select',
}

enum Triggers {
    none = 'none',
    save = 'save',
    select = 'select',
    savenew = 'savenew',
}

interface MousePosition {
    x: number
    y: number
}

interface ObjectState {
    action: ObjectActionState
}

interface MouseState {
    held: MouseHeldState
    position: MousePosition
    moving: MouseMovingState
    pressing: MouseButton
    double_click: boolean
    hover: MouseHoverState
    away: boolean
}

interface ICanvas {
    action: ObjectActionState
    mode: Mode
    mouse: MouseState
    active_dialog: {
        rect: Rect | null
        type: DialogsEnum
    }
    object_status: ObjectState
}

export class CanvasMode {
    static get Mode() {
        return Mode
    }

    static get ObjectActionState() {
        return ObjectActionState
    }
    static get MouseHeldState() {
        return MouseHeldState
    }
    static get MouseMovingState() {
        return MouseMovingState
    }
    static get MouseHoverState() {
        return MouseHoverState
    }
    static get Triggers() {
        return Triggers
    }

    static get MouseButton() {
        return MouseButton
    }
}

interface Actions {
    set_mouse_held(boolean: boolean): void
    set_mouse_double_click(boolean: boolean): void
    set_action(payload: ObjectActionState): void
    set_mouse_hover(boolean: boolean): void
    set_dialog_active(type: DialogsEnum, rect: Rect): void
    set_mouse_moving(boolean: boolean): void
    set_object_status(payload: ObjectState): void
    set_mode(payload: Mode): void
    set_mouse_pressing(payload: MouseButton | number): void
    conditions(): {
        mode: { select: boolean; draw: boolean }
        mouse: {
            hover: boolean
            held: boolean
            position: MousePosition
            moving: boolean
            double_click: boolean
            away: boolean
        }
        dialog: { action: boolean; label: boolean; none: boolean }
        pressing: {
            middle: boolean
            left: boolean
            right: boolean
            none: boolean
        }
        action: {
            drawing: boolean
            resizing: boolean
            none: boolean
            moving: boolean
        }
    }
    set_mouse_position(payload: MousePosition): void
    set_mouse_away(boolean: boolean): void
}

interface Getters extends _GettersTree<ObjectState> {}

export const useCanvas = defineStore<'canstore', ICanvas, Getters, Actions>(
    'canstore',
    {
        state: () =>
            ({
                action: ObjectActionState.none,
                mode: Mode.none,
                active_dialog: {
                    rect: null,
                    type: DialogsEnum.none,
                },
                mouse: {
                    held: MouseHeldState.none,
                    moving: MouseMovingState.none,
                    pressing: MouseButton.none,
                    hover: MouseHoverState.none,
                    double_click: false,
                    away: false,
                    position: {
                        x: 0,
                        y: 0,
                    },
                },
                trigger: null,
                object_status: {
                    action: ObjectActionState.none,
                    rect: null,
                },
            } as ICanvas),
        getters: {},
        actions: {
            set_mode(payload: Mode) {
                this.mode = payload
            },
            set_dialog_active(type: DialogsEnum, rect: Rect) {
                this.active_dialog = {
                    type,
                    rect,
                }
            },
            set_mouse_pressing(payload: MouseButton | number) {
                this.mouse.pressing = payload
            },
            set_mouse_held(boolean: boolean) {
                this.mouse.held = boolean
                    ? MouseHeldState.active
                    : MouseHeldState.none
            },
            set_mouse_double_click(boolean: boolean) {
                this.mouse.double_click = boolean
            },
            set_mouse_moving(boolean: boolean) {
                this.mouse.moving = boolean
                    ? MouseMovingState.active
                    : MouseMovingState.none
            },
            set_mouse_hover(boolean: boolean) {
                this.mouse.hover = boolean
                    ? MouseHoverState.active
                    : MouseHoverState.none
            },
            set_object_status(payload: ObjectState) {
                this.object_status = payload
            },
            set_action(payload: ObjectActionState) {
                this.action = payload
            },
            set_mouse_position(payload: MousePosition) {
                this.mouse.position = payload
            },
            set_mouse_away(boolean: boolean) {
                this.mouse.away = boolean
            },
            conditions() {
                return {
                    mouse: {
                        held: this.mouse.held === MouseHeldState.active,
                        hover: this.mouse.hover === MouseHoverState.active,
                        moving: this.mouse.moving === MouseMovingState.active,
                        double_click: this.mouse.double_click,
                        position: this.mouse.position,
                        away: this.mouse.away,
                    },
                    mode: {
                        draw: this.mode === Mode.draw,
                        select: this.mode === Mode.select,
                    },
                    pressing: {
                        left: this.mouse.pressing === MouseButton.left,
                        right: this.mouse.pressing === MouseButton.right,
                        middle: this.mouse.pressing === MouseButton.middle,
                        none: this.mouse.pressing === MouseButton.none,
                    },
                    dialog: {
                        action: this.active_dialog.type === DialogsEnum.action,
                        label: this.active_dialog.type === DialogsEnum.label,
                        none: this.active_dialog.type === DialogsEnum.none,
                    },
                    action: {
                        drawing:
                            this.object_status.action ===
                            ObjectActionState.drawing,
                        resizing:
                            this.object_status.action ===
                            ObjectActionState.resizing,
                        moving:
                            this.object_status.action ===
                            ObjectActionState.moving,
                        none:
                            this.object_status.action ===
                            ObjectActionState.none,
                    },
                }
            },
        },
    },
)
