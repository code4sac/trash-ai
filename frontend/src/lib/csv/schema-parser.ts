import { JSONSchema7Definition } from 'json-schema'
import { MapJsonProperties } from './types'

export const flatMapPropertiesRecursive =
    <T>(fn: MapJsonProperties<T>, pathJoinStr: string = '_') =>
    (props: Record<string, JSONSchema7Definition>, path?: string) =>
        Object.entries(props).reduce((prev, [k, v]): T[] => {
            const joinedKey = path ? `${path}${pathJoinStr}${k}` : k
            const subProps = getObjOrArrProperties(v)
            if (subProps) {
                return prev.concat(
                    flatMapPropertiesRecursive(fn, pathJoinStr)(
                        subProps,
                        joinedKey,
                    ),
                )
            }

            return prev.concat(fn(joinedKey, props))
        }, [] as T[])

/**
 * Given a json schema definition, this function will return the list of object properties
 * if the definition is an object or an array of objects
 */
export const getObjOrArrProperties = (d: JSONSchema7Definition) => {
    if (typeof d === 'boolean') {
        return undefined
    }
    if (d.properties) {
        return d.properties
    }
    const item = Array.isArray(d.items) ? d.items[0] : d.items
    if (typeof item !== 'boolean' && item?.properties) {
        return item.properties
    }

    return undefined
}
