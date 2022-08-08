import { DrawCanvas, CursorTypes } from '@/lib/draw'
import { CanvasMode, DialogsEnum } from '@/lib/store'
import { log } from '@/lib/logging'

export const useNewDrawActions = (base: DrawCanvas) => {
    const drawing = (e: MouseEvent) => {
        const cond = base.cstate.conditions()
        if (cond.action.drawing && cond.mouse.held && cond.pressing.middle) {
            base.current_rect!.area.x2 = e.offsetX / base.scale
            base.current_rect!.area.y2 = e.offsetY / base.scale
            base.setElement(base.current_rect!)
            base.redraw()
        } else if (cond.action.drawing && !cond.mouse.held) {
            base.current_rect = null
            base.cstate.set_object_status({
                action: CanvasMode.ObjectActionState.none,
            })
            base.canvas!.style.cursor = CursorTypes.default
        }
    }

    const starting = (e: MouseEvent) => {
        const cond = base.cstate.conditions()
        log.debug(cond)
        if (!cond.mouse.hover && cond.action.none && cond.pressing.middle) {
            base.cstate.set_object_status({
                action: CanvasMode.ObjectActionState.drawing,
            })
            base.canvas!.style.cursor = CursorTypes.crosshair
            log.debug(
                'begun.',
                e.offsetX / base.scale,
                e.offsetY / base.scale,
                base.cstate,
            )
            base.current_rect = base.new()
            base.setElement(base.current_rect!)
            base.current_rect!.setCenter(
                e.offsetX / base.scale,
                e.offsetY / base.scale,
            )
            base.redraw()
            log.debug('drawing', base.current_rect!)
        }
    }

    const drawDone = (e: MouseEvent) => {
        const cond = base.cstate.conditions()
        if (cond.action.drawing) {
            log.debug('onclick finished', base.cstate, base.current_rect)
            base.redraw()
            base.resetStyles()
            // normalize rect
            base.current_rect!.normalizeArea()
            base.current_rect!.setDrawMousePosition(e, base)
            base.cstate.set_dialog_active(DialogsEnum.label, base.current_rect!)
            base.canvas!.style.cursor = CursorTypes.default
            base.current_rect = null
        }
    }

    const mouseleave = (_e: MouseEvent) => {
        if (base.cstate.conditions().action.drawing) {
            base.current_rect = null
            base.cstate.set_object_status({
                action: CanvasMode.ObjectActionState.none,
            })
            base.canvas!.style.cursor = CursorTypes.default
        }
    }

    const init = () => {
        base.subjects.mousehold.subscribe(starting)
        base.subjects.mousemove.subscribe(drawing)
        base.subjects.mouseup.subscribe(drawDone)
        base.subjects.mouseaway.subscribe(mouseleave)
    }
    return init
}
