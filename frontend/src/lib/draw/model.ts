import { log } from '@/lib/logging'
import { DrawCanvas } from '@/lib'

export class CanvasColorSchema {
    static readonly tensorFlow = {
        thickenss: 1,
        strokeStyle: 'red',
        fillstyle: 'rgba(251,247,25,0.2)', // yellow
        textColor: 'blue',
    }

    static readonly classification = {
        thickenss: 1,
        strokeStyle: 'blue',
        textColor: 'red',
        fillstyle: 'rgba(0,255,0,0.2)',
    }
}

export interface CanvasArgs {
    imageSrc: string
    saved_data?: IRect[]
    is_tf: boolean
    enable_listeners?: boolean
}

export interface IBound {
    x1: number
    y1: number
    x2: number
    y2: number
}

export class Bound {
    x1: number
    y1: number
    x2: number
    y2: number

    constructor({ x1, y1, x2, y2 }: IBound) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    get width() {
        return this.x2 - this.x1
    }
    get height() {
        return this.y2 - this.y1
    }

    static new() {
        return new Bound({
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
        })
    }
}

export interface IRect {
    id?: string
    label?: string
    score?: string
    area: Bound
    is_tf: boolean
    correction?: string
    remove?: boolean
}

export class Rect implements IRect {
    public score?: string
    public correction?: string
    public remove?: boolean
    public is_tf: boolean = false
    public id: string
    public label?: string
    public area: Bound

    constructor({ id, label, area, score, is_tf, remove, correction }: IRect) {
        this.remove = remove || false
        this.correction = correction || ''
        this.score = score
        this.is_tf = is_tf
        this.id = id || Math.random().toString()
        this.label = label
        this.area = new Bound(area)
        this.normalizeArea()
    }

    copy() {
        return new Rect(this)
    }

    setDrawMousePosition(e: MouseEvent, draw: DrawCanvas) {
        this.normalizeArea()
        let { x1, y1, x2, y2 } = this.area
        const w = x2 - x1
        const h = y2 - y1
        draw.cstate.set_mouse_position({
            x: e.clientX - w * draw.scale,
            y: e.clientY - h * draw.scale,
        })
    }

    tooSmall() {
        return this.width < 25 || this.height < 25
    }

    normalizeArea(): Rect {
        let { x1, y1, x2, y2 } = this.area
        x1 = Math.min(x1, x2)
        y1 = Math.min(y1, y2)
        x2 = Math.max(x1, x2)
        y2 = Math.max(y1, y2)
        this.area = new Bound({ x1, y1, x2, y2 })
        return this
    }

    public get text(): string {
        return this.label || ''
    }

    public setCenter(x: number, y: number) {
        const { x: cx, y: cy } = this.center()
        const dx = x - cx
        const dy = y - cy
        this.area.x1 = this.area.x1 + dx
        this.area.y1 = this.area.y1 + dy
        this.area.x2 = this.area.x2 + dx
        this.area.y2 = this.area.y2 + dy
        this.normalizeArea()
    }

    public center(): { x: number; y: number } {
        return {
            x: (this.area.x1 + this.area.x2) / 2,
            y: (this.area.y1 + this.area.y2) / 2,
        }
    }

    public inBox(x: number, y: number): boolean {
        return (
            x >= this.area.x1 &&
            x <= this.area.x2 &&
            y >= this.area.y1 &&
            y <= this.area.y2
        )
    }

    public textWidth(ctx: CanvasRenderingContext2D): number {
        return ctx.measureText(this.text).width
    }

    public textHeight(ctx: CanvasRenderingContext2D): number {
        log.debug(ctx.measureText(this.text))
        return this.height
    }

    public get width(): number {
        const w = Math.abs(this.area.x2 - this.area.x1)
        return w
    }

    public get height(): number {
        const h = Math.abs(this.area.y2 - this.area.y1)
        return h
    }

    public get left(): string {
        return Math.min(this.area.x1, this.area.x2) + 'px'
    }

    public get top(): string {
        return Math.min(this.area.y1, this.area.y2) + 'px'
    }
}

export enum CursorTypes {
    alias = 'alias',
    all_scroll = 'all-scroll',
    cell = 'cell',
    context_menu = 'context-menu',
    copy = 'copy',
    crosshair = 'crosshair',
    default = 'default',
    help = 'help',
    move = 'move',
    no_drop = 'no-drop',
    none = 'none',
    not_allowed = 'not-allowed',
    pointer = 'pointer',
    progress = 'progress',
    text = 'text',
    vertical_text = 'vertical-text',
    wait = 'wait',
    zoom_in = 'zoom-in',
    zoom_out = 'zoom-out',

    resize_col = 'col-resize',
    resize_row = 'row-resize',
    resize_ew = 'ew-resize',
    resize_nesw = 'nesw-resize',
    resize_ns = 'ns-resize',

    resize_n = 'n-resize',
    resize_ne = 'ne-resize',
    resize_e = 'e-resize',
    resize_se = 'se-resize',
    resize_s = 's-resize',
    resize_sw = 'sw-resize',
    resize_w = 'w-resize',
    resize_nw = 'nw-resize',
}

export enum EventListenTypes {
    none = 'none',
    click = 'click',
    double_click = 'double_click',
    mouse_move = 'mouse_move',
    mouse_down = 'mouse_down',
    mouse_up = 'mouse_up',
    mouse_held = 'mouse_held',
    mouse_over = 'mouse_over',
}

interface IActionState {
    Cursor?: string
    Mode?: string
    Status?: string
    Callbacks?: (() => void)[]
    RectCallback?: (rect: Rect) => void
    MouseCallbacks?: ((e: MouseEvent) => void)[]
}

export class ActionState {
    Cursor?: string
    Mode?: string
    Status?: string
    Callbacks?: (() => void)[]
    RectCallback?: (rect: Rect) => void = () => {}
    MouseCallbacks?: ((e: MouseEvent) => void)[] = []

    constructor({
        Cursor,
        Mode,
        Status,
        RectCallback,
        MouseCallbacks,
    }: IActionState) {
        this.Cursor = Cursor
        this.Mode = Mode
        this.Status = Status
        this.RectCallback = RectCallback
        this.MouseCallbacks = MouseCallbacks
    }
}

interface IAction {
    name: string
    dialog?: string
    trigger?: string
    any_conditions?: (() => boolean)[]
    all_conditions?: (() => boolean)[]
    ActionState: ActionState
    listen_type: EventListenTypes
}

export class Action {
    name: string
    dialog?: string
    trigger?: string
    ActionState: ActionState
    any_conditions?: (() => boolean)[]
    all_conditions?: (() => boolean)[]
    listen_type: EventListenTypes = EventListenTypes.none
    constructor({
        name,
        dialog,
        trigger,
        ActionState,
        listen_type,
        any_conditions,
        all_conditions,
    }: IAction) {
        this.name = name
        this.all_conditions = all_conditions
        this.any_conditions = any_conditions
        this.dialog = dialog
        this.trigger = trigger
        this.ActionState = ActionState
        this.listen_type = listen_type
    }
}
