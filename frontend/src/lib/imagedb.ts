import Dexie from 'dexie'
import * as m from '@/lib/models'
import { log } from '@/lib/logging'

export const dataURLtoBlob = (dataUrl: string) => {
    let arr = dataUrl!.split(','),
        mime = arr[0].match(/:(.*?);/)![1],
        bstr = window.atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

export class ImageDb extends Dexie {
    images!: Dexie.Table<m.BaseImage, string>
    savedata!: Dexie.Table<m.SaveData, string>

    constructor() {
        super('ImageDatabase')
        const db = this

        db.version(1).stores({
            images: 'hash',
            savedata: 'hash',
        })

        db.images.mapToClass(m.BaseImage)
        db.savedata.mapToClass(m.SaveData)
    }
    async removeAll() {
        await Promise.all([
            this.transaction('rw', this.images, async () => {
                log.debug('removing all images')
                await this.images.clear()
            }),
            this.transaction('rw', this.savedata, async () => {
                log.debug('removing all savedata')
                await this.savedata.clear()
            }),
        ])
        await this.delete()
        await this.open()
    }
}

export var imagedb = new ImageDb()
