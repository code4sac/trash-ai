import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import {
    GraphModel,
    loadGraphModel,
    image as img,
    tidy,
    browser,
    Tensor,
    dispose,
} from '@tensorflow/tfjs'
import { log } from '@/lib/logging'
import { useCache } from '@/lib/store'
import { Rect, Bound } from '@/lib/draw'
import { BaseImage } from '@/lib/models'

export class TensorFlow {
    private static instance: TensorFlow
    model?: GraphModel
    name_map?: { [key: string]: string } = {}
    loaded = false

    private constructor() {
        log.debug('TensorFlow constructor')
    }

    public static getInstance() {
        if (!TensorFlow.instance) {
            TensorFlow.instance = new TensorFlow()
            TensorFlow.instance.load().then(() => {
                log.debug('TensorFlow loaded')
                TensorFlow.instance.loaded = true
            })
            log.debug('TensorFlow created')
        }
        return TensorFlow.instance
    }

    async load(): Promise<void> {
        const cache = useCache()
        const indexeddb_name = `indexeddb://tf-model`
        this.name_map = await fetch(`/model/name_map.json`).then((res) =>
            res.json(),
        )
        try {
            this.model = await loadGraphModel(indexeddb_name)
            log.debug('loaded model from indexeddb')
        } catch (e) {
            log.debug(`No cached model found.`)
            this.model = await loadGraphModel(`/model/model.json`)
            this.model.save(indexeddb_name)
        }
        const nm = Object.keys(this.name_map ?? {})
            .map((k) => this.name_map![k])
            .sort()
        cache.setLabels(nm)
        this.loaded = true
        log.debug('modal initialized: name_map', this.name_map)
        log.debug('modal initialized: model', this.model)
    }

    static async get_name_map() {
        const inst = TensorFlow.getInstance()
        while (!inst.name_map?.length) {
            await new Promise((resolve) => setTimeout(resolve, 100))
        }
        return inst.name_map
    }

    async processImage(itemOrig: BaseImage): Promise<Rect[]> {
        return new Promise<Rect[]>(async (resolve) => {
            const image = new Image()
            image.onload = async () => {
                log.debug('processing Image', itemOrig)
                const canvas = document.createElement('canvas')
                canvas.id = itemOrig.hash!
                const ctx = canvas.getContext('2d')
                canvas.width = image.width
                canvas.height = image.height
                log.debug('size: ', canvas.width, canvas.height)
                if (ctx == null) {
                    throw new Error('no context')
                }
                ctx.drawImage(image, 0, 0)
                const [modelWidth, modelHeight] =
                    this.model!.inputs![0].shape!.slice(1, 3)

                const input = tidy(() => {
                    return img
                        .resizeBilinear(browser.fromPixels(image), [
                            modelWidth,
                            modelHeight,
                        ])
                        .div(255.0)
                        .expandDims(0)
                })

                const res: Tensor[] = (await this.model!.executeAsync(
                    input,
                )) as Tensor[]
                const [boxes, scores, classes, valid_detections] = res
                const boxes_data = boxes.dataSync()
                const scores_data = scores.dataSync()
                const classes_data = classes.dataSync()
                const valid_detections_data = valid_detections.dataSync()[0]
                log.debug('boxes', boxes_data)
                log.debug('scores', scores_data)
                log.debug('classes', classes_data)
                log.debug('valid_detections', valid_detections_data)
                dispose(res)

                let i
                const jarr: Rect[] = []
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= canvas.width
                    x2 *= canvas.width
                    y1 *= canvas.height
                    y2 *= canvas.height
                    const score = scores_data[i].toFixed(2)
                    const label = this.name_map![classes_data[i]]
                    const meta = new Rect({
                        area: new Bound({ x1, y1, x2, y2 }),
                        score,
                        label,
                        is_tf: true,
                    })
                    if (!meta.tooSmall()) {
                        jarr.push(meta)
                    }
                }
                log.debug('jarr', jarr)
                resolve(jarr)
            }
            image.src = itemOrig.dataUrl!
        })
    }
}

export default TensorFlow
