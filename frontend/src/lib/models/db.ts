import c from 'crypto-js'
import lodash from 'lodash'
import { dataURLtoBlob } from '@/lib/imagedb'
import { ExifParserFactory } from 'ts-exif-parser'
import { ExifSave } from './exif'
import { imagedb } from '@/lib/imagedb'
import { TFMetaData } from './tfmeta'
import { Display } from './trashai'

export interface ISaveData {
    hash: string
    exif?: ExifSave
    tf_meta?: TFMetaData[]
    filename?: string
    origdataUrl?: string
    smalldataUrl?: string
    thumbdataUrl?: string
    processeddataUrl?: string
}

export class SaveData {
    hash: string
    exif?: ExifSave
    tf_meta?: TFMetaData[]
    origdataUrl?: string
    smalldataUrl?: string
    thumbdataUrl?: string
    filename?: string
    processeddataUrl?: string
    constructor({
        hash,
        exif,
        tf_meta,
        origdataUrl,
        smalldataUrl,
        thumbdataUrl,
        processeddataUrl,
        filename,
    }: ISaveData) {
        this.smalldataUrl = smalldataUrl
        this.thumbdataUrl = thumbdataUrl
        this.filename = filename
        this.hash = hash
        this.exif = exif
        this.tf_meta = tf_meta
        this.origdataUrl = origdataUrl
        this.processeddataUrl = processeddataUrl
    }

    get prettyExif() {
        return JSON.stringify(this.exif, null, 2)
    }

    get prettyTFMeta() {
        return JSON.stringify(this.tf_meta, null, 2)
    }

    get detectedObjects() {
        const names = this.tf_meta?.map((m) => m.name)
        // unique
        return lodash.uniq(names)
    }

    get display() {
        const lat = this.exif?.GPSLatitude
        const lng = this.exif?.GPSLongitude
        const gps = lat && lng ? { lat, lng } : undefined
        return new Display(
            this.hash!,
            this.filename!,
            this.thumbdataUrl!,
            this.detectedObjects.length > 0,
            gps,
        )
    }

    async save() {
        return await imagedb.transaction('rw', imagedb.savedata, async () => {
            this.hash = await imagedb.savedata.put(this)
        })
    }

    static async getData(hash: string) {
        const entry = await imagedb.savedata.get(hash)
        return entry
    }
}

export class BaseImage {
    hash: string | undefined
    complete = false
    err: string | undefined
    size?: number
    uploaded = false
    uploadExists = false
    exifdata: ExifSave | undefined
    dataUrl: string | undefined
    filename: string | undefined

    constructor({
        hash,
        dataUrl,
        filename,
    }: {
        hash?: string
        dataUrl?: string
        filename?: string
    }) {
        this.hash = hash
        this.dataUrl = dataUrl
        this.complete = true
        this.filename = filename
    }

    async exif(): Promise<ExifSave> {
        if (this.dataUrl == null) {
            throw new Error('no dataUrl')
        }
        const blob = await this.toBlob()
        const ab = await blob.arrayBuffer()
        const exp = ExifParserFactory.create(ab)
        const exif = exp.parse()
        const t = new ExifSave(exif)
        return t
    }

    async toBlob(): Promise<Blob> {
        return dataURLtoBlob(this.dataUrl!)
    }

    static async fromFile(file: File) {
        return new Promise<BaseImage>(async (resolve, reject) => {
            const img = new BaseImage({})
            // generate random id
            img.filename = file.name || 'unknown'
            img.size = file.size
            // check to make sure it's a jpg
            if (file.type !== 'image/jpeg') {
                img.err = 'not a jpg'
                return img
            }
            const reader = new FileReader()

            reader.onloadend = async (evt) => {
                if (evt!.target!.readyState === FileReader.DONE) {
                    const dataUrl = evt!.target!.result as string
                    const hash = await BaseImage.dataURLtoHash(dataUrl)
                    img.hash = hash
                    img.dataUrl = dataUrl
                    const exist = await imagedb.images.get(img.hash!)
                    if (exist == null) {
                        img.exifdata = await img.exif()
                        img.save()
                        img.complete = true
                        console.log('image saved', this)
                        resolve(img)
                    } else {
                        img.complete = true
                        console.log('image already saved', img)
                        resolve(img)
                    }
                } else {
                    img.err = 'unknown error'
                    img.complete = true
                    console.error('image load failed!')
                    reject(img)
                }
            }
            reader.readAsDataURL(file)
        })
    }

    static async get(hash: string) {
        const dat = await imagedb.images.get(hash)
        const img = new BaseImage({
            dataUrl: dat!.dataUrl,
            hash: dat!.hash,
        })
        img.complete = true
        return img
    }

    async save() {
        return await imagedb.transaction('rw', imagedb.images, async () => {
            this.hash = await imagedb.images.put(this)
        })
    }

    static async dataURLtoHash(dataurl: string) {
        return c.SHA256(dataurl).toString()
    }
}
