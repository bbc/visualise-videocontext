// @flow

export const getOrThrow = <K, V>(map: Map<K, V>, key: K): V => {
    const value = map.get(key)
    if (value != null) {
        return value
    } else {
        throw new Error('Could not find key in map.')
    }
}

const splitStringAtIndex = (string, index) => [
    string.substring(0, index),
    string.substring(index),
]

export const breakLabelIntoLines = (label: string, maxLength: number) => {
    if (label.length > maxLength) {
        const [first, second] = splitStringAtIndex(label, maxLength)
        return [first, breakLabelIntoLines(second, maxLength)].join('\n')
    } else {
        return label
    }
}

export const capitaliseFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
