import { GpsGroup } from './gps'
import type { ExifSave } from './exif'
import type { Coordinate } from '.'
import { log } from '@/lib/logging'

export class TrashObject {
    name: string
    count: number
    hashes: string[]
    constructor(name: string) {
        this.name = name
        this.hashes = []
        this.count = 0
    }
}

export class Summary {
    detected_objects: TrashObject[]
    no_detection_hashes: string[]
    unique_detections: number
    total_detections: number
    gps: GpsGroup

    constructor() {
        this.detected_objects = []
        this.gps = new GpsGroup()
        this.no_detection_hashes = []
        this.total_detections = 0
        this.unique_detections = 0
    }

    ins_gps(hash: string, exif: ExifSave) {
        this.gps.list.push({
            coordinate: exif!.gps,
            hash: hash,
        })
    }

    reset() {
        this.detected_objects = []
        this.gps = new GpsGroup()
        this.no_detection_hashes = []
        this.total_detections = 0
        this.unique_detections = 0
    }

    detection_by_name(name: string): TrashObject | undefined {
        const obj = this.detected_objects.find((obj) => {
            return obj.name === name
        })
        return obj
    }

    detection_by_index(idx: number): TrashObject | undefined {
        const lst = this.page_list()
        if (idx < 0 || idx >= lst.length) {
            return undefined
        }
        return lst[idx]
    }

    page_list() {
        return this.detected_objects.sort((a, b) => {
            return b.count - a.count
        })
    }

    set_total_detections() {
        let sum = 0
        this.detected_objects.forEach((obj) => {
            sum += obj.count
        })
        this.total_detections = sum
    }

    set_unique_detections() {
        this.unique_detections = this.detected_objects.length
    }

    update() {
        this.set_total_detections()
        this.set_unique_detections()
    }
}

export class Display {
    hash: string
    filename: string
    has_detection: boolean
    smalldataUrl?: string
    gps?: Coordinate

    constructor(
        hash: string,
        filename: string,
        imagedata: string,
        has_detection = false,
        gps?: Coordinate,
    ) {
        this.has_detection = has_detection
        this.hash = hash
        this.filename = filename
        this.smalldataUrl = imagedata
        this.gps = gps
    }
}

export interface Capacity {
    usage: number
    remaining: number
    has_capacity: boolean
}

export class StorageCapacity {
    private static bytesToMB(bytes: number) {
        return Math.round(bytes / (1024 * 1024))
    }

    public static async getCapacity(): Promise<Capacity> {
        const cap = await navigator.storage.estimate()
        return {
            usage: StorageCapacity.bytesToMB(cap.usage ?? 0),
            remaining: StorageCapacity.bytesToMB(cap.quota ?? 0),
            has_capacity: (cap.quota ?? 0) > 0,
        }
    }
}

export class Progress {
    public total: number
    public complete: number
    public name: string
    public current: string | null

    constructor(name: string) {
        this.name = name
        this.total = 0
        this.current = null
        this.complete = 0
    }

    public reset() {
        this.total = 0
        this.complete = 0
        this.current = null
    }

    get percent(): number {
        const val = this.total > 0 ? (this.complete / this.total) * 100 : 0
        log.debug(`${this.name} progress: ${val}%`)
        return Math.round(val)
    }
}
