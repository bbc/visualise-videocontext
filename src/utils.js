const stringify = properties => (
    JSON.stringify(properties, (key, val) => (
        val.toFixed ? Number(val.toFixed(2)) : val
    ))
)

export const createNode = (id, props) => ({
    data: { id },
    classes: props.type,
})

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
        return `TransitionNode\nDefinition: ${props.definition.title}\nProperties: ${stringify(props.properties)}`
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

export default createNode
