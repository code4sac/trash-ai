import { DrawCanvas, CursorTypes } from '@/lib/draw'
import { CanvasMode } from '@/lib/store'
import { log } from '@/lib/logging'
import { useAppStore } from '@/lib/store'

export const useMoveActions = (base: DrawCanvas) => {
    const appstore = useAppStore()
    const moveStart = (e: MouseEvent) => {
        const cond = base.cstate.conditions()
        const rect = base.findClosest(e)

        if (rect?.is_tf) {
            base.canvas!.style.cursor = CursorTypes.not_allowed
            appstore.setCanvasMessage('Cannot move a Tensorflow Object')
            setTimeout(() => {
                appstore.setCanvasMessage('')
            }, 3000)
        } else if (rect) {
            if (cond.mouse.hover && cond.action.none) {
                base.cstate.set_object_status({
                    action: CanvasMode.ObjectActionState.moving,
                })
                base.canvas!.style.cursor = CursorTypes.move
                base.current_rect = rect!
                log.debug('pre saved', base.classifications)
            }
        }
    }

    const moveDone = async (_e: MouseEvent) => {
        if (
            base.cstate.object_status.action ===
            CanvasMode.ObjectActionState.moving
        ) {
            log.debug('mouse up', _e)
            base.cstate.set_object_status({
                action: CanvasMode.ObjectActionState.none,
            })
            base.resetStyles()
            // overwrite the rect with the new one
            base.classifications = base.classifications.filter(
                (r) => r.id !== base.current_rect!.id,
            )
            base.classifications.push(base.current_rect!)
            log.debug('post saved', base.classifications)
            base.current_rect = null
            base.canvas!.style.cursor = CursorTypes.default
            await base.updateDb()
        }
    }

    const moveMouse = (e: MouseEvent) => {
        const cond = base.cstate.conditions()
        if (cond.mouse.held && cond.action.moving && cond.mouse.hover) {
            base.current_rect?.setCenter(
                e.offsetX / base.scale,
                e.offsetY / base.scale,
            )
            base.setElement(base.current_rect!)
            base.redraw()
        }
    }

    const init = () => {
        base.subjects.mousehold.subscribe(moveStart)
        base.subjects.mouseup.subscribe(moveDone)
        base.subjects.mousemove.subscribe(moveMouse)
    }
    return init
}
