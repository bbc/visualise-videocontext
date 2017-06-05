export const createNode = (id, props) => ({
    data: { id },
    classes: props.type,
})

export const animateNodeChange = ele => {
    ele.stop(true, false)
    ele.style('background-blacken', -1)
    ele.animate({
        style: {
            'background-blacken': 0,
        },
        duration: 500,
    })
}

export default createNode

const splitStringAtIndex = (string, index) => [
    string.substring(0, index),
    string.substring(index),
]

export const breakLabelIntoLines = (label, maxLength) => {
    if (label.length > maxLength) {
        const [first, second] = splitStringAtIndex(label, maxLength)
        return [first, breakLabelIntoLines(second, maxLength)].join('\n')
    } else {
        return label
    }
}
