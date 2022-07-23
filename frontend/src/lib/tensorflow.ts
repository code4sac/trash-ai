import * as tf from '@tensorflow/tfjs'
import { TFMetaData } from '@/lib/models'
import * as m from '@/lib/models'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'

const resizeImage = async (
    imgsrc: string,
    maxWidth: number,
    maxHeight: number,
): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = imgsrc

        img.onload = function () {
            let ratio = 0 // Used for aspect ratio
            // Get current dimensions
            let width = img.width
            let height = img.height
            console.log('dimensions: ' + width + 'x' + height)

            // If the current width is larger than the max, scale height
            // to ratio of max width to current and then set width to max.
            if (width > maxWidth) {
                console.log('Shrinking width (and scaling height)')
                ratio = maxWidth / width
                height = height * ratio
                width = maxWidth
                console.log('new dimensions: ' + width + 'x' + height)
            }

            // If the current height is larger than the max, scale width
            // to ratio of max height to current and then set height to max.
            if (height > maxHeight) {
                console.log('Shrinking height (and scaling width)')
                ratio = maxHeight / height
                width = width * ratio
                height = maxHeight
                console.log('new dimensions: ' + width + 'x' + height)
            }

            const oc = document.createElement('canvas')
            const octx = oc.getContext('2d')
            oc.width = width
            oc.height = height
            octx!.drawImage(img, 0, 0, oc.width, oc.height)
            resolve(oc.toDataURL('image/jpeg'))
        }
    })
}

export class TensorFlow {
    private static instance: TensorFlow
    model?: tf.GraphModel
    name_map?: { [key: string]: string } = {}
    loaded = false

    private constructor() {
        console.log('TensorFlow constructor')
    }

    public static getInstance() {
        if (!TensorFlow.instance) {
            TensorFlow.instance = new TensorFlow()
            TensorFlow.instance.load().then(() => {
                console.log('TensorFlow loaded')
                TensorFlow.instance.loaded = true
            })
            console.log('TensorFlow created')
        }
        return TensorFlow.instance
    }

    async load(): Promise<void> {
        const indexeddb_name = `indexeddb://tf-model`
        this.name_map = await fetch(`/model/name_map.json`).then((res) =>
            res.json(),
        )
        try {
            this.model = await tf.loadGraphModel(indexeddb_name)
            console.log('loaded model from indexeddb')
        } catch (e) {
            console.log(`No cached model found.`)
            this.model = await tf.loadGraphModel(`/model/model.json`)
            this.model.save(indexeddb_name)
        }
        this.loaded = true
        console.log('modal initialized: name_map', this.name_map)
        console.log('modal initialized: model', this.model)
    }

    async processImage(itemOrig: m.BaseImage): Promise<m.SaveData> {
        return new Promise<m.SaveData>(async (resolve) => {
            const image = new Image()
            image.onload = async () => {
                console.log('processing Image', itemOrig)
                // await preCb(itemOrig)
                const item = new m.SaveData({
                    hash: itemOrig.hash!,
                })
                const canvas = document.createElement('canvas')
                canvas.id = itemOrig.hash!
                const ctx = canvas.getContext('2d')
                canvas.width = image.width + 100
                canvas.height = image.height + 100
                console.log('size: ', canvas.width, canvas.height)
                if (ctx == null) {
                    throw new Error('no context')
                }
                // pad all side by 100px
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, image.width + 100, image.height + 100)
                ctx.drawImage(image, 50, 50)

                const [modelWidth, modelHeight] =
                    this.model!.inputs![0].shape!.slice(1, 3)

                const input = tf.tidy(() => {
                    return tf.image
                        .resizeBilinear(tf.browser.fromPixels(image), [
                            modelWidth,
                            modelHeight,
                        ])
                        .div(255.0)
                        .expandDims(0)
                })

                const res: tf.Tensor[] = (await this.model!.executeAsync(
                    input,
                )) as tf.Tensor[]
                const [boxes, scores, classes, valid_detections] = res
                const boxes_data = boxes.dataSync()
                const scores_data = scores.dataSync()
                const classes_data = classes.dataSync()
                const valid_detections_data = valid_detections.dataSync()[0]
                console.log('boxes', boxes_data)
                console.log('scores', scores_data)
                console.log('classes', classes_data)
                console.log('valid_detections', valid_detections_data)
                tf.dispose(res)

                const font = '14px sans-serif'
                ctx.font = font
                ctx.textBaseline = 'top'
                let i
                const jarr: TFMetaData[] = []
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= canvas.width
                    x2 *= canvas.width
                    y1 *= canvas.height
                    y2 *= canvas.height
                    const width = x2 - x1
                    const height = y2 - y1
                    const score = scores_data[i].toFixed(2)
                    const name = this.name_map![classes_data[i]]
                    const meta = new TFMetaData(
                        x1,
                        y1,
                        x2,
                        y2,
                        width,
                        height,
                        score,
                        name,
                    )
                    jarr.push(meta)
                    ctx.strokeStyle = '#00FFFF'
                    ctx.lineWidth = 1
                    ctx.strokeRect(x1, y1, width, height)

                    // Draw the label background.
                    ctx.fillStyle = '#00FFFF'
                    const textWidth = ctx.measureText(`${name}:${score}`).width
                    const textHeight = parseInt(font, 10) // base 10
                    ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4)
                }
                console.log('jarr', jarr)

                // Draw the bounding box.
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= canvas.width
                    y1 *= canvas.height
                    const score = scores_data[i].toFixed(2)
                    const name = this.name_map![classes_data[i]]

                    // Draw the text last to ensure it's on top.
                    ctx.fillStyle = '#000000'
                    ctx.fillText(`${name}:${score}`, x1, y1)
                }
                item.tf_meta = jarr
                item.processeddataUrl = canvas.toDataURL('image/jpeg')
                item.filename = itemOrig.filename
                item.exif = await itemOrig.exif()
                item.origdataUrl = itemOrig.dataUrl
                item.smalldataUrl = await resizeImage(
                    item.processeddataUrl,
                    1000,
                    1000,
                )
                item.thumbdataUrl = await resizeImage(
                    item.processeddataUrl,
                    200,
                    200,
                )
                await item.save()
                image.remove()
                canvas.remove()
                console.log('processed Image', item)
                resolve(item)
            }
            image.src = itemOrig.dataUrl!
        })
    }
}

export default TensorFlow
