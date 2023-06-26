import { describe, expect, test } from '@jest/globals'
import { JSONSchema7 } from 'json-schema'
import { getCsvHeadersFromJsonSchema, objectToCsv } from './csv'

describe('csv', () => {
    const headers = ['id', 'fruit', 'cultivar', 'inSeason']
    const obj = {
        id: 1,
        fruits: [
            {
                fruit: 'apple',
                cultivar: 'gala',
                inSeason: false,
            },
            {
                fruit: 'apple',
                cultivar: 'red delicious',
                inSeason: true,
            },
            {
                fruit: 'pear',
                cultivar: 'bosc',
                inSeason: false,
            },
            {
                fruit: 'pear',
                cultivar: 'bartlett',
                inSeason: true,
            },
        ],
    }
    type Fruits = typeof obj

    test('getCsvHeaders returns the proper headers', () => {
        const headers = getCsvHeadersFromJsonSchema(jsonSchema)
        expect(headers).toStrictEqual([
            'hash',
            'filename',
            'exifdata.Make',
            'exifdata.Model',
            'exifdata.DateTimeOriginal',
            'exifdata.ModifyDate',
            'exifdata.CreateDate',
            'exifdata.GPSLatitudeRef',
            'exifdata.GPSLatitude',
            'exifdata.GPSLongitudeRef',
            'exifdata.GPSLongitude',
            'exifdata.GPSAltitudeRef',
            'exifdata.GPSAltitude',
            'exifdata.GPSTimeStamp',
            'exifdata.GPSDateStamp',
            'exifdata.ExifImageWidth',
            'exifdata.ExifImageHeight',
            'metadata.score',
            'metadata.correction',
            'metadata.remove',
            'metadata.is_tf',
            'metadata.id',
            'metadata.label',
            'metadata.area.x1',
            'metadata.area.y1',
            'metadata.area.x2',
            'metadata.area.y2',
        ])
    })
    test('objToCsv correctly converts an object to a data string', () => {
        const csv = objectToCsv(headers, (fruit: Fruits) =>
            fruit.fruits.map((f) => [
                fruit.id,
                f.fruit,
                f.cultivar,
                f.inSeason,
            ]),
        )(obj)
        expect(csv).toEqual(
            '1,apple,gala,false\n' +
                '1,apple,red delicious,true\n' +
                '1,pear,bosc,false\n' +
                '1,pear,bartlett,true',
        )
    })

    test('objToCsv throws if row lengths are invalid', () => {
        const csv = () =>
            objectToCsv(headers, (fruit: Fruits) =>
                fruit.fruits.map((f) => [f.fruit, f.cultivar, f.inSeason]),
            )(obj)
        expect(csv).toThrowError()
    })
})

const jsonSchema: JSONSchema7 = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
        hash: { type: 'string' },
        filename: { type: 'string' },
        exifdata: {
            type: 'object',
            properties: {
                Make: { type: 'string' },
                Model: { type: 'string' },
                DateTimeOriginal: { type: 'integer' },
                ModifyDate: { type: 'integer' },
                CreateDate: { type: 'integer' },
                GPSLatitudeRef: { type: 'string' },
                GPSLatitude: { type: 'number' },
                GPSLongitudeRef: { type: 'string' },
                GPSLongitude: { type: 'number' },
                GPSAltitudeRef: { type: 'integer' },
                GPSAltitude: { type: 'number' },
                GPSTimeStamp: {
                    type: 'array',
                    items: { type: 'integer' },
                },
                GPSDateStamp: { type: 'string' },
                ExifImageWidth: { type: 'integer' },
                ExifImageHeight: { type: 'integer' },
            },
            required: [
                'Make',
                'Model',
                'DateTimeOriginal',
                'ModifyDate',
                'CreateDate',
                'GPSLatitudeRef',
                'GPSLatitude',
                'GPSLongitudeRef',
                'GPSLongitude',
                'GPSAltitudeRef',
                'GPSAltitude',
                'GPSTimeStamp',
                'GPSDateStamp',
                'ExifImageWidth',
                'ExifImageHeight',
            ],
        },
        metadata: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    score: { type: 'string' },
                    correction: { type: 'string' },
                    remove: { type: 'boolean' },
                    is_tf: { type: 'boolean' },
                    id: { type: 'string' },
                    label: { type: 'string' },
                    area: {
                        type: 'object',
                        properties: {
                            x1: { type: 'number' },
                            y1: { type: 'number' },
                            x2: { type: 'number' },
                            y2: { type: 'number' },
                        },
                        required: ['x1', 'y1', 'x2', 'y2'],
                    },
                },
                required: [
                    'score',
                    'correction',
                    'remove',
                    'is_tf',
                    'id',
                    'label',
                    'area',
                ],
            },
        },
    },
    required: ['hash', 'filename', 'exifdata', 'metadata'],
}
