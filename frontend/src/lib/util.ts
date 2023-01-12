import { log } from '@/lib/logging'

export const getRatio = (
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
): { width: number; height: number } => {
    log.debug('dimensions: ' + width + 'x' + height)
    let ratio = 0 // Used for aspect ratio

    // If the current width is larger than the max, scale height
    // to ratio of max width to current and then set width to max.
    if (width > maxWidth) {
        log.debug('Shrinking width (and scaling height)')
        ratio = maxWidth / width
        height = height * ratio
        width = maxWidth
        log.debug('new dimensions: ' + width + 'x' + height)
    }

    // If the current height is larger than the max, scale width
    // to ratio of max height to current and then set height to max.
    if (height > maxHeight) {
        log.debug('Shrinking height (and scaling width)')
        ratio = maxHeight / height
        width = width * ratio
        height = maxHeight
        log.debug('new dimensions: ' + width + 'x' + height)
    }

    return {
        width,
        height,
    }
}

export const resizeImage = async (
    imgsrc: string,
    maxWidth: number,
    maxHeight: number,
): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = imgsrc

        img.onload = function () {
            // Get current dimensions
            let width = img.width
            let height = img.height
            const ratio = getRatio(width, height, maxWidth, maxHeight)

            const oc = document.createElement('canvas')
            const octx = oc.getContext('2d')
            oc.width = ratio.width
            oc.height = ratio.height
            octx!.drawImage(img, 0, 0, oc.width, oc.height)
            resolve(oc.toDataURL('image/jpeg'))
        }
    })
}

export const getAverageRGB = (data: ImageData) => {
    let blockSize = 5, // only visit every 5 pixels
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0

    length = data.data.length

    while ((i += blockSize * 4) < length) {
        ++count
        rgb.r += data.data[i]
        rgb.g += data.data[i + 1]
        rgb.b += data.data[i + 2]
    }
    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count)
    rgb.g = ~~(rgb.g / count)
    rgb.b = ~~(rgb.b / count)
    return rgb
}

export const invertImageData = (data: ImageData) => {
    length = data.data.length
    // const { width, height } = data
    // for (let i = 0; i < width; i++) {
    //     for (let j = 0; j < height; j++) {
    //         const index = (i + j * width) * 4
    //         data.data[index] = 255 - data.data[index]
    //         data.data[index + 1] = 255 - data.data[index + 1]
    //         data.data[index + 2] = 255 - data.data[index + 2]
    //     }
    // }
    for (var i = 0; i < length; i += 4) {
        data.data[i] = data.data[i] ^ 255
        data.data[i + 1] = data.data[i + 1] ^ 255
        data.data[i + 2] = data.data[i + 2] ^ 255
    }
    return data
}


export function Timer(callback: Function, time: number) {
    // @ts-ignore
    this.setTimeout(callback, time)
}

Timer.prototype.setTimeout = function (callback: Function, time: number) {
    var self = this
    if (this.timer) {
        clearTimeout(this.timer)
    }
    this.finished = false
    this.callback = callback
    this.time = time
    this.timer = setTimeout(function () {
        self.finished = true
        callback()
    }, time)
    this.start = Date.now()
}

Timer.prototype.add = function (time: number) {
    if (!this.finished) {
        // add time to time left
        time = this.time - (Date.now() - this.start) + time
        this.setTimeout(this.callback, time)
    }
}
