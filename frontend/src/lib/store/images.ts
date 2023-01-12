import { imagedb, dataURLtoBlob } from '@/lib/imagedb'
import { saveAs } from 'file-saver'
import TensorFlow from '@/lib/tensorflow'
import JSZip from 'jszip'
import lodash from 'lodash'
import { defineStore } from 'pinia'
import type { _GettersTree } from 'pinia'
import { log } from '@/lib/logging'
import PQueue from 'p-queue'
import { DrawCanvas } from '@/lib/draw'
import { resizeImage } from '@/lib/util'
import {
    Display,
    Progress,
    Capacity,
    Summary,
    PAGE_SIZE,
    StorageCapacity,
    BaseImage,
    SaveData,
    TrashObject,
} from '@/lib/models'

let initialized = false

class QueueManager {
    private static instance: QueueManager
    upload_queue: PQueue
    processor_queue: PQueue
    // state_refresh_queue: PQueue
    private constructor() {
        this.upload_queue = new PQueue({ concurrency: 1 })
        this.processor_queue = new PQueue({ concurrency: 1 })
        // this.state_refresh_queue = new PQueue({ concurrency: 1 })
    }
    public static getInstance() {
        if (!QueueManager.instance) {
            QueueManager.instance = new QueueManager()
            log.debug('QueueManager created')
        }
        return QueueManager.instance
    }
}

export interface ImageState {
    current_save_data: Display | null
    upload: Progress
    process: Progress
    is_processing: boolean
    zip: Progress
    state_busy: boolean
    hash_ids: string[]
    capacity: Capacity
    summary: Summary
}

interface Actions {
    doupload(files?: File[] | FileList): Promise<void>
    nav_hash_ids(idx: number): string[]
    download_all(): Promise<unknown>
    clear(): Promise<void>
    doinit(): Promise<void>
    do_sampleupload(): Promise<void>
    setUploadQueue(): void
    setProcessorQueue(): void
}

interface Getters extends _GettersTree<ImageState> {
    process_busy(state: ImageState): boolean
    zip_busy(state: ImageState): boolean
    upload_busy(state: ImageState): boolean
    nav_length(state: ImageState): number
    busy(state: ImageState): boolean
}

export const useImageStore = defineStore<
    'images',
    ImageState,
    Getters,
    Actions
>('images', {
    persist: true,
    state: (): ImageState => ({
        upload: new Progress('Upload'),
        zip: new Progress('Zip'),
        process: new Progress('Tf Process'),

        state_busy: false,
        is_processing: false,
        summary: new Summary(),
        current_save_data: null,
        capacity: {
            remaining: 0,
            usage: 0,
            has_capacity: false,
        },
        hash_ids: [],
    }),
    getters: {
        nav_length(state: ImageState): number {
            const plen = state.hash_ids.length / PAGE_SIZE
            return Math.ceil(plen)
        },
        upload_busy(state: ImageState) {
            return state.upload.total > 0
        },
        process_busy(state: ImageState) {
            return state.process.total > 0
        },
        zip_busy(state: ImageState) {
            return state.zip.total > 0
        },
        busy(state: ImageState) {
            return (
                state.upload.total > 0 ||
                state.process.total > 0 ||
                state.zip.total > 0
            )
        },
    },
    actions: {
        nav_hash_ids(idx: number): string[] {
            const start = idx * PAGE_SIZE
            const end = start + PAGE_SIZE
            return this.hash_ids.slice(start, end)
        },

        async clear() {
            this.summary.reset()
            this.hash_ids = []
            this.is_processing = false
            await imagedb.removeAll()
            this.capacity = await StorageCapacity.getCapacity()
        },
        async do_sampleupload() {
            const sample_files = async () => {
                const files = [
                    'sample01.jpg',
                    'sample02.jpg',
                    'sample03.jpg',
                    'sample05.jpg',
                    'sample06.jpg',
                    'sample07.jpg',
                    'sample08.jpg',
                ]
                const retval = []
                for (let i = 0; i < files.length; i++) {
                    const file = files[i]
                    const url = `/samples/${file}`
                    const blob = await fetch(url).then((r) => r.blob())
                    retval.push(
                        new File([blob], file, {
                            type: blob.type,
                        }),
                    )
                }
                return retval
            }
            const files = await sample_files()
            await this.doupload(files)
        },

        setUploadQueue() {
            const qm = QueueManager.getInstance()
            qm.upload_queue.addListener('add', () => {
                this.upload.total++
                log.debug('upload add')
            })
            qm.upload_queue.addListener('error', (err) => {
                log.debug('upload error', err)
            })
            qm.upload_queue.addListener('idle', () => {
                this.upload.reset()
                this.process.current = null
                log.debug('upload queue idle')
            })
            qm.upload_queue.addListener(
                'completed',
                async (image: BaseImage | null) => {
                    this.upload.complete++
                    if (!image) {
                        return
                    }
                    // })
                    log.debug('upload complete', image, qm.upload_queue.size)
                    qm.processor_queue.add(async () => {
                        log.debug('adding image', image)
                        let pimg = await SaveData.getData(image.hash!)
                        if (pimg == null) {
                            pimg = await SaveData.new(image)
                            const tfmeta =
                                await TensorFlow.getInstance().processImage(
                                    image,
                                )
                            pimg.tf_meta = tfmeta
                            log.debug('tfmeta', pimg.tf_meta)

                            await pimg.save()
                            const c = new DrawCanvas({
                                imageSrc: image.dataUrl!,
                                sdata: pimg,
                                is_tf: true,
                            })
                            await c.load()
                            pimg!.processeddataUrl =
                                c.canvas!.toDataURL('image/jpeg')
                            pimg!.smalldataUrl = await resizeImage(
                                pimg!.processeddataUrl,
                                1000,
                                1000,
                            )
                            pimg!.thumbdataUrl = await resizeImage(
                                pimg!.processeddataUrl,
                                200,
                                200,
                            )
                            await pimg!.save()
                        }
                        this.hash_ids.push(image.hash!)
                        this.process.current = pimg.filename ?? ''
                        return pimg
                    })
                },
            )
        },

        setProcessorQueue() {
            const qm = QueueManager.getInstance()
            qm.processor_queue.addListener('add', () => {
                log.debug('processor queue add')
                this.process.total++
            })
            qm.processor_queue.addListener('error', (err) => {
                log.error('process error', err)
            })
            qm.processor_queue.addListener('idle', async () => {
                this.process.reset()
                this.current_save_data = null
                this.process.current = null
                this.summary.update()
                this.capacity = await StorageCapacity.getCapacity()
                this.is_processing = false
                log.debug('process queue idle')
            })
            qm.processor_queue.addListener(
                'completed',
                async (pimg: SaveData) => {
                    this.process.complete++
                    if (pimg?.display?.gps != null) {
                        this.summary.gps.list.push({
                            coordinate: pimg.display.gps,
                            hash: pimg.hash,
                        })
                    }
                    if (pimg?.tf_meta == null || pimg.tf_meta.length === 0) {
                        this.summary.no_detection_hashes.push(pimg?.hash!)
                    }
                    pimg?.tf_meta?.forEach((meta) => {
                        let s: TrashObject | undefined =
                            this.summary.detected_objects.find((obj) => {
                                return obj.name === meta.label
                            })
                        if (s == undefined) {
                            s = new TrashObject(meta.label ?? '')
                            s.count++
                            this.summary.detected_objects.push(s)
                        }

                        s.count++
                        const has_hash =
                            lodash.indexOf(s.hashes, pimg?.hash) > -1
                        if (!has_hash) {
                            s.hashes.push(pimg?.hash!)
                        }
                    })
                    this.current_save_data = pimg!.display
                    await imagedb.images.delete(pimg!.hash!)
                    this.capacity = await StorageCapacity.getCapacity()
                    this.summary.update()
                },
            )
        },

        async doupload(files?: File[] | FileList) {
            if (!files) {
                return
            }
            this.is_processing = true
            const qm = QueueManager.getInstance()
            log.debug('uploading files', typeof files, files)
            lodash.forEach(files, (file: File) => {
                qm.upload_queue.add(async () => {
                    const image = await BaseImage.fromFile(file)
                    const exist = await imagedb.savedata.get(image.hash!)
                    if (exist) {
                        log.debug('image already exists', image.hash!)
                        return null
                    }
                    this.upload.current = image.filename ?? ''
                    return image
                })
            })
        },

        async doinit() {
            if (!initialized) {
                this.setUploadQueue()
                this.setProcessorQueue()
                // this.setStateRefreshQueue()
                initialized = true
            }
        },

        async download_all() {
            const zip = new JSZip()
            const datestr = new Date().toISOString().split('T')[0]
            const ts = new Date().getTime()
            const bname = `trash-ai-images-${datestr}-${ts}`
            const zname = `${bname}.zip`
            const folder = zip.folder(bname)
            // summary
            const sname = `summary.json`
            const summary = JSON.stringify(this.summary)
            folder!.file(sname, summary)
            const zp = this.zip

            return new Promise(async (resolve) => {
                zp.total = await imagedb.savedata.count()
                await imagedb.savedata.each((image: SaveData) => {
                    zp.current = image.filename ?? ''
                    const blob = dataURLtoBlob(image!.processeddataUrl!)
                    const origblob = dataURLtoBlob(image!.origdataUrl!)
                    const fbase = `${image.hash!}`

                    // detect
                    const pngname = `${fbase}-detect.jpg`
                    folder!.file(pngname, blob)

                    // orig
                    const origname = `${fbase}.jpg`
                    folder!.file(origname, origblob)

                    const mname = `${fbase}.json`
                    // metadata
                    folder!.file(
                        mname,
                        JSON.stringify({
                            hash: image.hash!,
                            filename: image.filename!,
                            exifdata: image.exif!,
                            metadata: image!.tf_meta,
                        }),
                    )
                    zp.complete++
                    log.debug('Zip progress: ', zp.percent)
                })
                zip.generateAsync({ type: 'blob' }).then(function (blob) {
                    saveAs(blob, zname)
                })
                zp.reset()
                resolve(true)
            })
        },
    },
})
