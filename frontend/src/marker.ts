export interface Coordinate {
    lat: number | undefined
    lng: number | undefined
}

export interface GpsInfo {
    coordinate?: Coordinate
    hash: string
}

export class GpsGroup {
    list: GpsInfo[] = []
    constructor() {
        this.list = []
    }

    get center(): Coordinate {
        let X = 0.0
        let Y = 0.0
        let Z = 0.0
        let cnt = 0
        this.list.forEach((i: GpsInfo) => {
            if (!i.coordinate) {
                return
            }
            cnt++
            const lat = i.coordinate.lat
            const lng = i.coordinate.lng
            if (lat && lng) {
                const x = (lat * Math.PI) / 180
                const y = (lng * Math.PI) / 180
                X += Math.cos(x) * Math.cos(y)
                Y += Math.cos(x) * Math.sin(y)
                Z += Math.sin(x)
            }
        })
        X /= cnt
        Y /= cnt
        Z /= cnt

        const lon = Math.atan2(Y, X)
        const hyp = Math.sqrt(X * X + Y * Y)
        const lat = Math.atan2(Z, hyp)
        const newX = (lat * 180) / Math.PI
        const newY = (lon * 180) / Math.PI
        return { lat: newX, lng: newY }
    }
}
