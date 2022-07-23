import type { ExifData } from 'ts-exif-parser'
import type { Coordinate } from './gps'

export class ExifSave {
    Make?: string
    Model?: string
    DateTimeOriginal?: number
    ModifyDate?: number
    CreateDate?: number
    GPSLatitudeRef?: string
    GPSLatitude?: number
    GPSLongitudeRef?: string
    GPSLongitude?: number
    GPSAltitudeRef?: string
    GPSAltitude?: number
    GPSTimeStamp?: string
    GPSImgDirectionRef?: string
    GPSImgDirection?: string
    GPSDateStamp?: string
    ExifImageWidth?: number
    ExifImageHeight?: number

    constructor(exif: ExifData) {
        this.Make = exif.tags?.Make
        this.Make = exif.tags?.Make
        this.Model = exif.tags?.Model
        this.DateTimeOriginal = exif.tags?.DateTimeOriginal
        this.ModifyDate = exif.tags?.ModifyDate
        this.CreateDate = exif.tags?.CreateDate
        this.GPSLatitudeRef = exif.tags?.GPSLatitudeRef
        this.GPSLatitude = exif.tags?.GPSLatitude
        this.GPSLongitudeRef = exif.tags?.GPSLongitudeRef
        this.GPSLongitude = exif.tags?.GPSLongitude
        this.GPSAltitudeRef = exif.tags?.GPSAltitudeRef
        this.GPSAltitude = exif.tags?.GPSAltitude
        this.GPSTimeStamp = exif.tags?.GPSTimeStamp
        this.GPSImgDirectionRef = exif.tags?.GPSImgDirectionRef
        this.GPSImgDirection = exif.tags?.GPSImgDirection
        this.GPSDateStamp = exif.tags?.GPSDateStamp
        this.ExifImageWidth = exif.tags?.ExifImageWidth
        this.ExifImageHeight = exif.tags?.ExifImageHeight
    }

    get gps(): Coordinate | undefined {
        if (this.GPSLatitude && this.GPSLongitude) {
            return {
                lat: this.GPSLatitude,
                lng: this.GPSLongitude,
            }
        }
        return undefined
    }
}

// {
//     "startMarker": {
//         "offset": 0
//     },
//     "tags": {
//         "ImageWidth": 2268,
//         "ImageHeight": 4032,
//         "Make": "Google",
//         "Model": "Pixel 6 Pro",
//         "Orientation": 1,
//         "XResolution": 72,
//         "YResolution": 72,
//         "ResolutionUnit": 2,
//         "Software": "HDR+ 1.0.450594208zd",
//         "ModifyDate": 1657752173,
//         "YCbCrPositioning": 1,
//         "GPSLatitudeRef": "N",
//         "GPSLatitude": 36.87036666666667,
//         "GPSLongitudeRef": "W",
//         "GPSLongitude": -119.75038888888889,
//         "GPSAltitudeRef": 0,
//         "GPSAltitude": 85.09,
//         "GPSTimeStamp": [
//             5,
//             42,
//             39
//         ],
//         "GPSImgDirectionRef": "M",
//         "GPSImgDirection": 315,
//         "GPSDateStamp": "2022:07:14",
//         "ExposureTime": 0.00833,
//         "FNumber": 1.85,
//         "ExposureProgram": 2,
//         "ISO": 4533,
//         "DateTimeOriginal": 1657752173,
//         "CreateDate": 1657752173,
//         "undefined": "-07:00",
//         "ShutterSpeedValue": 6.91,
//         "ApertureValue": 1.78,
//         "BrightnessValue": -1.82,
//         "ExposureCompensation": 0,
//         "MaxApertureValue": 1.78,
//         "SubjectDistance": 1.522,
//         "MeteringMode": 2,
//         "Flash": 16,
//         "FocalLength": 6.81,
//         "SubSecTime": "929",
//         "SubSecTimeOriginal": "929",
//         "SubSecTimeDigitized": "929",
//         "ColorSpace": 1,
//         "ExifImageWidth": 2268,
//         "ExifImageHeight": 4032,
//         "SensingMethod": 2,
//         "CustomRendered": 1,
//         "ExposureMode": 0,
//         "WhiteBalance": 0,
//         "DigitalZoomRatio": 0,
//         "FocalLengthIn35mmFormat": 24,
//         "SceneCaptureType": 0,
//         "Contrast": 0,
//         "Saturation": 0,
//         "Sharpness": 0,
//         "SubjectDistanceRange": 2,
//         "LensMake": "Google",
//         "LensModel": "Pixel 6 Pro back camera 6.81mm f/1.85",
//         "InteropIndex": "R98"
//     },
//     "imageSize": {
//         "height": 4032,
//         "width": 2268
//     },
//     "thumbnailOffset": 1339,
//     "thumbnailLength": 16256,
//     "thumbnailType": 6,
//     "app1Offset": 6
// }
