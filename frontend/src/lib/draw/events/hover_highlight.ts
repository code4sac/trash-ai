import { DrawCanvas, HoverEvent } from '@/lib/draw'
import { useAppStore } from '@/lib/store'

const MAX_HEIGHT = 500
const MAX_WIDTH = 500

export const useHoverHighLightActions = (base: DrawCanvas) => {
    const astore = useAppStore()
    const move = async (h: HoverEvent) => {
        const cond = base.cstate.conditions()
        if (cond.action.drawing || !h.rect || cond.mouse.away) {
            astore.setHighLightImage(0, 0, null, null)
        } else {
            const imgstr = base.fullsize_canvas?.extract(h.rect!)
            const cimage = await new Promise<HTMLImageElement>((resolve) => {
                const cimage = new Image()
                cimage.onload = () => {
                    resolve(cimage)
                }
                cimage.src = imgstr!.image
            })
            const ratio = Math.min(
                (Math.min(MAX_WIDTH, window.outerWidth - 10, 10000000) / h.rect!.width),
                (Math.min(MAX_HEIGHT, window.outerHeight - 10, 10000000) / h.rect!.height),
            )

            if (ratio < 1) {
                cimage.width = h.rect!.width * ratio
                cimage.height = h.rect!.height * ratio
            }
            const brect = base.canvas!.getBoundingClientRect()

            let xpos = brect.x + h.rect!.area.x2 * base.scale
            let ypos = brect.y + h.rect!.area.y1 * base.scale - cimage.height
            if (ypos < 0) {
                ypos = 0
            }
            const page_width = window.innerWidth
            const page_height = window.innerHeight
            while (ypos + cimage.height > page_height) {
                ypos -= 1
            }

            while (xpos + cimage.width > page_width) {
                xpos -= 1
            }
            while (xpos < 0) {
                xpos += 1
            }


            astore.setHighLightImage(
                xpos,
                ypos,
                {
                    height: cimage.height,
                    width: cimage.width,
                    image: imgstr!.image,
                    full_height: h.rect!.height,
                    full_width: h.rect!.width,
                },
                h.rect,
            )
            // setHighLightImage(e: MouseEvent, image: Extract | null, rect: Rect | null): void
        }
    }

    // const mouseleave = (_e: MouseEvent) => {
    // }

    const init = () => {
        base.subjects.hover_highlight.subscribe(move)
        // base.subjects.mouseaway.subscribe(mouseleave)
    }
    return init
}
