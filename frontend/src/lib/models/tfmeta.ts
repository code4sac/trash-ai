export class TFMetaData {
    x1: number
    y1: number
    x2: number
    y2: number
    width: number
    height: number
    score: string
    name: string

    constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        width: number,
        height: number,
        score: string,
        name: string,
    ) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.width = width
        this.height = height
        this.score = score
        this.name = name
    }
}
