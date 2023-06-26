import { JSONSchema7Definition } from 'json-schema'
import {
    flatMapPropertiesRecursive,
    getObjOrArrProperties,
} from './schema-parser'
import { MapJsonProperties } from './types'

export const objectToCsv =
    <T>(
        headers: string[],
        fnFlatten: (obj: T) => (string | number | boolean)[][],
        joinStr: string = ',',
    ) =>
    (obj: T) => {
        const csvData = fnFlatten(obj)
        const errorRows = csvData.filter((v) => v.length !== headers.length)
        if (errorRows.length !== 0) {
            throw new Error(
                `All csv rows must have the same length as the headers array ${JSON.stringify(
                    headers,
                )}, see incorrect rows: ${JSON.stringify(errorRows)}`,
            )
        }
        return [headers, ...csvData].map((row) => row.join(joinStr)).join('\n')
    }

export const getCsvHeadersFromJsonSchema = (
    jsonSchema: JSONSchema7Definition,
) => {
    const props = getObjOrArrProperties(jsonSchema)
    return props ? flatMapPropertiesRecursive(getJsonKeys, '.')(props) : []
}

const getJsonKeys: MapJsonProperties<string> = (k) => [k]
