import { JSONSchema7Definition } from 'json-schema'

export type MapJsonProperties<T> = (
    key: string,
    props: Record<string, JSONSchema7Definition>,
) => T[]
