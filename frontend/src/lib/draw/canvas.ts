import { fromEvent, Subject } from 'rxjs'
import {
    Rect,
    // issue 89 - disabling until we actually do something with classification
    // useMoveActions,
    // useNewDrawActions,
    useHoverHighLightActions,
    CanvasColorSchema,
    IRect,
    Bound,
    CursorTypes,
} from '@/lib/draw'
import { resizeImage } from '@/lib/util'
import { useCanvas, CanvasMode, DialogsEnum } from '@/lib/store'
import { invertImageData, getAverageRGB } from '@/lib/util'
import { SaveData } from '@/lib/models'
import { log } from '@/lib/logging'

const PARENT_NAME = 'canvasparent'

export interface Extract {
    image: string
    width: number
    height: number
    full_width: number
    full_height: number
}

class FullSizeCanvas {
    canvas: HTMLCanvasElement
    image: HTMLImageElement
    ctx: CanvasRenderingContext2D
    constructor(image: HTMLImageElement) {
        this.image = image
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.canvas.width = image.width
        this.canvas.height = image.height
        this.ctx.drawImage(image, 0, 0)
    }

    extract(r: Rect): Extract {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        canvas.width = r.width
        canvas.height = r.height
        ctx.drawImage(
            this.image,
            r.area.x1,
            r.area.y1,
            r.width,
            r.height,
            0,
            0,
            r.width,
            r.height,
        )
        return {
            image: canvas.toDataURL(),
            width: r.width,
            height: r.height,
            full_width: this.image.width,
            full_height: this.image.height,
        }
    }
}

export class HoverEvent {
    e: MouseEvent
    rect: Rect | null
    constructor(e: MouseEvent, rect: Rect | null) {
        this.e = e
        this.rect = rect
    }
}

interface Subjects {
    double_click: Subject<MouseEvent>
    mousemove: Subject<MouseEvent>
    mousehold: Subject<MouseEvent>
    mouseup: Subject<MouseEvent>
    mouseleft: Subject<MouseEvent>
    mousemiddle: Subject<MouseEvent>
    hover_highlight: Subject<HoverEvent>
    mouseaway: Subject<MouseEvent>
}

interface CanvasArgs {
    imageSrc: string
    sdata?: SaveData
    is_tf?: boolean
}

export class DrawCanvas {
    canvas: HTMLCanvasElement | null
    fullsize_canvas: FullSizeCanvas | null = null
    // highlight_div: HTMLDivElement | null = null
    imgSrc: string
    image?: HTMLImageElement
    ctx: CanvasRenderingContext2D | null = null
    public cstate
    classifications: Rect[] = []
    scale: number = 1
    sdata?: SaveData
    parent: HTMLElement | null = null
    subjects: Subjects
    current_rect: Rect | null = null
    is_tf: boolean = false

    constructor({ imageSrc, sdata, is_tf }: CanvasArgs) {
        this.cstate = useCanvas()
        this.imgSrc = imageSrc
        this.sdata = sdata
        this.classifications = sdata?.tf_meta?.map((v) => new Rect(v)) || []
        sdata?.classifications?.forEach((v) => {
            this.classifications.push(new Rect(v))
        })
        log.debug('sdata', sdata)
        this.canvas = null
        this.is_tf = is_tf || false
        this.subjects = {
            mouseaway: new Subject<MouseEvent>(),
            hover_highlight: new Subject<HoverEvent>(),
            double_click: new Subject<MouseEvent>(),
            mousemove: new Subject<MouseEvent>(),
            mousehold: new Subject<MouseEvent>(),
            mouseup: new Subject<MouseEvent>(),
            mouseleft: new Subject<MouseEvent>(),
            mousemiddle: new Subject<MouseEvent>(),
        }
    }

    load() {
        this.canvas = document.createElement('canvas')
        this.image = new Image()
        this.image.src = this.imgSrc
        return new Promise((resolve) => {
            this.image!.onload = () => {
                this.fullsize_canvas = new FullSizeCanvas(this.image!)
                this.parent = document.getElementById(
                    PARENT_NAME,
                ) as HTMLDivElement
                if (this.parent) {
                    this.parent.innerHTML = ''
                    this.parent.appendChild(this.canvas!)
                }
                this.ctx = this.canvas!.getContext('2d')!
                this.scale = this.getScale()
                log.debug(
                    'parent',
                    this.parent?.clientWidth,
                    this.parent?.clientHeight,
                    this.scale,
                )
                this.canvas!.width = this.image!.width * this.scale
                this.canvas!.height = this.image!.height * this.scale
                this.resetStyles()
                this.redraw()
                if (!this.is_tf) {
                    // useMoveActions(this)()
                    // useNewDrawActions(this)()
                    useHoverHighLightActions(this)()
                    this.eventSubscribe()
                }
                log.debug('canvas loaded', this.canvas, this.scale)
                resolve(true)
            }
        })
    }

    getScale() {
        if (this.is_tf) {
            return 1
        }
        log.debug('canvas', { document: document.body })
        const p = {
            width: document.body.clientWidth - 200,
            height: document.body.clientHeight - 200,
        }
        const i = {
            width: this.image?.width || 0,
            height: this.image?.height || 0,
        }
        const w = p.width / i.width
        const h = p.height / i.height

        const m = Math.min(w, h)
        if (m > 1) {
            return 1
        }
        return m
    }

    resetStyles() {
        this.ctx!.strokeStyle = 'red'
        this.ctx!.fillStyle = 'red'
        this.ctx!.lineWidth = 1
    }

    reset() {
        this.canvas!.style.cursor = CursorTypes.default
        this.resetStyles()
        this.redraw()
    }

    delete(id: string) {
        this.classifications = this.classifications.filter(
            (rect) => rect.id !== id,
        )
        this.redraw()
    }

    clear() {
        this.canvas!.innerHTML = ''
        this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
        this.ctx!.drawImage(
            this.image!,
            0,
            0,
            this.canvas!.width,
            this.canvas!.height,
        )
    }

    redraw() {
        this.clear()
        this.classifications.forEach((rect) => {
            this.setElement(rect)
        })
    }

    toDbData(): IRect[] {
        return this.classifications.map((rect) => {
            return {
                id: rect.id,
                label: rect.label,
                area: rect.area,
                is_tf: rect.is_tf,
            }
        })
    }

    drawCross(area: Bound, color: string, thickness: number) {
        this.ctx!.beginPath()
        let { x1, y1, x2, y2 } = area
        x1 = x1 * this.scale
        y1 = y1 * this.scale
        x2 = x2 * this.scale
        y2 = y2 * this.scale

        this.ctx!.moveTo(x1, y1)
        this.ctx!.lineTo(x2, y2)
        this.ctx!.moveTo(x1, y2)
        this.ctx!.lineTo(x2, y1)
        this.ctx!.strokeStyle = color
        // thickness
        this.ctx!.lineWidth = thickness
        this.ctx!.closePath()
        this.ctx!.stroke()
    }

    drawBox(r: Rect, fg?: string, padding?: number) {
        this.ctx!.strokeStyle = fg || this.colorScheme(r).strokeStyle
        let x1, x2, y1, y2

        if (padding) {
            x1 = r.area.x1 - padding
            x2 = r.area.x2 + padding
            y1 = r.area.y1 - padding
            y2 = r.area.y2 + padding
        } else {
            x1 = r.area.x1
            x2 = r.area.x2
            y1 = r.area.y1
            y2 = r.area.y2
        }
        this.ctx!.lineWidth = 3
        this.ctx!.strokeRect(
            Math.min(x1, x2) * this.scale,
            Math.min(y1, y2) * this.scale,
            Math.abs(x2 - x1) * this.scale,
            Math.abs(y2 - y1) * this.scale,
        )
        this.resetStyles()
    }

    drawText(rect: Rect, btext: string, xtext?: string) {
        // start with a large font size

        const fontBase = 800
        const getFont = (fontsize: number) => {
            var ratio = fontsize / fontBase / this.scale
            var cSize = this.canvas!.width * ratio
            return (cSize | 0) + 'px sans-serif'
        }

        const getFontSize = (text: string, area: Bound) => {
            const minFontSize = 30
            var fontsize = 50

            // lower the font size until the text fits the canvas
            let metrics = this.ctx!.measureText(text)
            do {
                fontsize--
                this.ctx!.font = getFont(fontsize)
                metrics = this.ctx!.measureText(text)
            } while (metrics.width > area.width && fontsize > minFontSize)

            let fontHeight =
                metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent

            let minx = Math.min(area.x1, area.x2, 100000000)
            let maxx = Math.max(area.x1, area.x2, 0, minx + metrics.width)
            let miny = Math.min(area.y1, area.y2, 100000000)
            let maxy = Math.max(area.y1, area.y2, 0, miny + fontHeight)
            while (((maxx * this.scale) + (this.canvas!.clientWidth - this.canvas!.width) > this.canvas!.width)) {
                maxx -= 10
                minx -= 10
            }

            while (((maxy * this.scale) + (this.canvas!.clientHeight - this.canvas!.height) + (fontHeight * this.scale) > this.canvas!.height)) {
                maxy -= 50
                miny -= 50
            }

            const hlbound = new Bound({
                x1: minx - 5,
                x2: maxx + 5,
                y1: maxy + 5,
                y2: maxy + fontHeight,
            })

            const hlwidth = Math.abs(hlbound.x1 - hlbound.x2)
            const hlheight = Math.abs(hlbound.y1 - hlbound.y2)
            const highlightImagedata = this.ctx!.getImageData(
                hlbound.x1 * this.scale,
                hlbound.y1 * this.scale,
                hlwidth * this.scale,
                hlheight * this.scale,
            )

            const ivdata = invertImageData(highlightImagedata)
            const avgRgb = getAverageRGB(ivdata)

            const tmprect = new Rect({
                area: hlbound,
                label: btext,
                is_tf: false,
                id: '',
            })
            tmprect.area = hlbound

            return {
                fontsize,
                fontHeight,
                minx,
                miny,
                maxx,
                maxy,
                avgRgb,
                tmprect,
                // hlbound,
                // metrics,
                // highlightImagedata,
                // ivdata,
            }
        }

        btext = rect.score ? `${rect.label} (${rect.score})` : (rect.label ?? '??')


        const bfont = getFontSize(`${btext}`, rect.area)

        const xcopy = xtext ? rect.copy() : null
        if (xcopy) {
            xcopy.area.y1 = 0
            // xcopy.area.y2 = bfont.miny - (rect.height + (bfont.fontHeight * 2))
            xcopy.area.y2 = bfont.miny - (bfont.tmprect.area.height + 5)
        }
        const xfont = xcopy ? getFontSize(xtext!, xcopy.area) : null

        const cond = this.cstate.conditions()

        if (!cond.mouse.held) {
            this.drawHighlight(
                bfont.tmprect,
                `rgba(${bfont.avgRgb.r}, ${bfont.avgRgb.g}, ${bfont.avgRgb.b}, .8)`,
            )
            if (xfont) {
                this.drawHighlight(
                    xfont.tmprect,
                    `rgba(${xfont.avgRgb.r}, ${xfont.avgRgb.g}, ${xfont.avgRgb.b}, .8)`,
                )
            }
        }

        let middlex = (bfont.minx * this.scale + bfont.maxx * this.scale) / 2
        this.ctx!.textAlign = 'center'
        this.ctx!.textBaseline = 'bottom'
        this.ctx!.fillStyle = this.colorScheme(rect).textColor

        this.ctx!.font = getFont(bfont.fontsize * this.scale)
        this.ctx!.fillText(
            btext,
            middlex,
            (bfont.maxy + bfont.fontHeight) * this.scale,
        )
        if (xtext) {
            this.drawCross(
                bfont.tmprect.area,
                this.colorScheme(rect).textColor,
                2,
            )
            middlex = (xfont!.minx * this.scale + xfont!.maxx * this.scale) / 2
            this.ctx!.font = getFont(xfont!.fontsize * this.scale)
            this.ctx!.fillText(
                xtext!,
                middlex,
                (xfont!.maxy + xfont!.fontHeight) * this.scale,
            )
        }

        this.resetStyles()
    }

    drawHighlight(r: Rect, fill?: string) {
        this.ctx!.fillStyle = fill || this.colorScheme(r).fillstyle
        this.ctx!.fillRect(
            Math.min(r.area.x1, r.area.x2) * this.scale,
            Math.min(r.area.y1, r.area.y2) * this.scale,
            Math.abs(r.area.x2 - r.area.x1) * this.scale,
            Math.abs(r.area.y2 - r.area.y1) * this.scale,
        )
        this.resetStyles()
    }

    colorScheme(r: Rect) {
        const cm = r.is_tf
            ? CanvasColorSchema.tensorFlow
            : CanvasColorSchema.classification
        return cm
    }

    async updateRect(r: Rect) {
        await this.sdata?.updateRect(r)
        const durl = this.canvas!.toDataURL()
        this.sdata!.processeddataUrl = durl
        this.sdata!.thumbdataUrl = await resizeImage(
            this.sdata!.processeddataUrl,
            200,
            200,
        )
        this.sdata!.smalldataUrl = await resizeImage(
            this.sdata!.processeddataUrl,
            1000,
            1000,
        )
        await this.updateDb()
    }

    async updateDb() {
        const user_classif = this.classifications.filter((rect) => !rect.is_tf)
        const tf_classif = this.classifications.filter((rect) => rect.is_tf)
        log.debug('user_classif', user_classif)
        log.debug('tf_classif', tf_classif)
        this.sdata!.classifications = user_classif
        this.sdata!.tf_meta = tf_classif
        await this.sdata!.update()
    }

    setElement(r: Rect) {
        if (r.correction) {
            this.drawText(r, r.text, r.correction)
        } else {
            this.drawText(r, r.text)
        }
        this.drawHighlight(r)
        this.drawBox(r)
        log.debug('drawing box', r, (r.is_tf, r.remove ?? false))
        if (r.is_tf && r.remove) {
            this.drawCross(r.area, 'red', 7)
        }
    }

    eventSubscribe() {
        let heldtimer = setTimeout(() => {}, 0)
        const mouseDown = (e: MouseEvent) => {
            let dotime = true
            clearTimeout(heldtimer)
            this.cstate.set_mouse_pressing(e.button)
            switch (e.button) {
                case CanvasMode.MouseButton.right:
                    dotime = false
                    break
                case CanvasMode.MouseButton.left:
                    this.subjects.mouseleft.next(e)
                    break
                case CanvasMode.MouseButton.middle:
                    this.subjects.mousemiddle.next(e)
                    break
            }

            if (dotime) {
                heldtimer = setTimeout(() => {
                    this.subjects.mousehold.next(e)
                    this.cstate.set_mouse_held(true)
                }, 200)
            }
        }
        fromEvent<MouseEvent>(this.canvas!, 'mouseleave').subscribe((e) => {
            this.cstate.set_mouse_pressing(CanvasMode.MouseButton.none)
            this.cstate.set_mouse_held(false)
            this.cstate.set_mouse_away(true)
            this.cstate.set_mouse_hover(false)
            setTimeout(() => {
                this.subjects.mouseaway.next(e)
            }, 200)
        })
        fromEvent<MouseEvent>(this.canvas!, 'mouseup').subscribe((e) => {
            clearTimeout(heldtimer)
            setTimeout(() => {
                this.cstate.set_mouse_pressing(-1)
            }, 300)
            this.cstate.set_mouse_held(false)
            this.subjects.mouseup.next(e)

            this.canvas!.style.cursor = CursorTypes.default
            if (!this.current_rect) {
                return
            }
        })

        fromEvent<MouseEvent>(this.canvas!, 'mousedown').subscribe((e) =>
            mouseDown(e),
        )
        fromEvent<MouseEvent>(this.canvas!, 'dblclick').subscribe((e) => {
            if (e.button === 0) {
                this.cstate.set_mouse_double_click(true)
                const rect = this.findClosest(e)
                const conds = this.cstate.conditions()
                log.debug('conds', conds)
                if (rect && !conds.dialog.action) {
                    log.debug('clicked on rect', rect)
                    this.current_rect = rect
                    this.current_rect!.normalizeArea()
                    this.current_rect!.setDrawMousePosition(e, this)
                    this.cstate.set_dialog_active(DialogsEnum.label, rect)
                }
                this.subjects.double_click.next(e)
            }
        })

        let movetime = setTimeout(() => {}, 0)

        fromEvent<MouseEvent>(this.canvas!, 'mousemove').subscribe((e) => {
            this.cstate.set_mouse_away(false)
            clearTimeout(movetime)
            this.cstate.set_mouse_moving(true)
            movetime = setTimeout(() => {
                this.cstate.set_mouse_moving(false)
            })
            const rect = this.findClosest(e)
            if (rect) {
                this.cstate.set_mouse_hover(true)
            } else {
                this.cstate.set_mouse_hover(false)
                this.cstate.set_mouse_double_click(false)
                this.subjects.hover_highlight.next(new HoverEvent(e, null))
            }
            this.subjects.mousemove.next(e)
            if (rect) {
                this.subjects.hover_highlight.next(new HoverEvent(e, rect))
            } else {
                this.subjects.hover_highlight.next(new HoverEvent(e, null))
            }
        })
    }

    new(): Rect {
        const rect = new Rect({
            area: new Bound({
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
            }),
            is_tf: false,
        })
        this.classifications.push(rect)
        return rect
    }

    findClosest(e: MouseEvent) {
        const rects = this.classifications.filter((r: Rect) =>
            r.inBox(e.offsetX / this.scale, e.offsetY / this.scale),
        )
        // get closest
        let closest: Rect | undefined = undefined
        if (rects.length > 0) {
            closest = rects.reduce((prev, curr) => {
                let pcenter = prev!.center()
                let ccenter = curr!.center()
                if (
                    Math.abs((pcenter.x - e.offsetX) / this.scale) +
                        Math.abs((pcenter.y - e.offsetY) / this.scale) <
                    Math.abs((ccenter.x - e.offsetX) / this.scale) +
                        Math.abs((ccenter.y - e.offsetY) / this.scale)
                ) {
                    return prev
                }
                return curr
            })
        }
        return closest
    }
}
