const stringify = properties => (
    JSON.stringify(properties, (key, val) => (
        val.toFixed ? Number(val.toFixed(2)) : val
    ))
)

export const createNode = (id, props) => ({
    data: { id },
    classes: props.type,
})

const formatTransitions = transitions => {
    // TODO: this is so hacky
    if (transitions.mix) {
        const lines = transitions.mix.map(mix => {
            return `Start: ${mix.start}s, value ${mix.current}. End: ${mix.end}s, value ${mix.target}`
        })
        return lines.join('\n')
    } else {
        return null
    }
}

const createLabel = props => {
    switch (props.type) {
    case 'VideoNode':
        return `VideoNode\n${props.url}\nstart: ${props.start}\nstop: ${props.stop}`
    case 'ImageNode':
        return `ImageNode\n${props.url}`
    case 'CanvasNode':
        return 'CanvasNode'
    case 'CompositingNode':
        return `CompositingNode\nDefinition: ${props.definition.title}\nProperties: ${stringify(props.properties)}`
    case 'TransitionNode':
        const transitionsString = formatTransitions(props.transitions) || stringify(props.transitions)
        return `TransitionNode\nDefinition: ${props.definition.title}\nProperties: ${stringify(props.properties)}\nTransitions:\n${transitionsString}`
    case 'EffectNode':
        return `EffectNode\nDefinition: ${props.definition.title}\nProperties: ${stringify(props.properties)}`
    case 'Destination':
        return 'Destination'
    default:
        return 'Unknown'
    }
}

export const setNodeLabel = (node, props) => {
    const label = createLabel(props)
    const oldLabel = node.style('label')
    const shouldUpdate = oldLabel !== label
    if (shouldUpdate) {
        node.style('label', label)
    }
    const didUpdateAndWasNotInitialUpdate = shouldUpdate && oldLabel !== ''
    return didUpdateAndWasNotInitialUpdate
}

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
