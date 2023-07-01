import { JSONSchema7Definition } from 'json-schema'
import {
    flatMapPropertiesRecursive,
    getObjOrArrProperties,
} from './schema-parser'
import { MapJsonProperties } from './types'

type Column = string | number | boolean

const quote = (s: string) => `"${s}"`
const constructDelimetedRow = (delimeter: string) => (row: Column[]) =>
    row.map((c) => (typeof c === 'string' ? quote(c) : c)).join(delimeter)
const addNewlines = (s: Column[]) => s.join('\n')

export const objectToCsv =
    <T>(
        headers: string[],
        fnFlatten: (obj: T) => Column[][],
        delimeter: string = ',',
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
        const rowsWithHeaders = [headers, ...csvData]
        const delimetedRows = rowsWithHeaders.map(
            constructDelimetedRow(delimeter),
        )
        return addNewlines(delimetedRows)
    }

/**
 * Traverses a json schema object and returns a flat array
 * representing the keys of all objects and subobjects.
 * Maintains nesting representation by joining keys together with '.'
 */
export const getCsvHeadersFromJsonSchema = (
    jsonSchema: JSONSchema7Definition,
) => {
    const props = getObjOrArrProperties(jsonSchema)
    return props ? flatMapPropertiesRecursive(getJsonKeys, '.')(props) : []
}

const getJsonKeys: MapJsonProperties<string> = (k) => [k]
