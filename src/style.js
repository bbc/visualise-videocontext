const stringify = properties => (
    JSON.stringify(properties, (key, val) => (
        val.toFixed ? Number(val.toFixed(2)) : val
    ))
)

const inputIdFromGraphNodeAtPosition = (node, i) => node.inputs[i] ? node.inputs[i].id : null

export function setEdgeColours (edge, data) {
    const targetId = edge.target().id()
    const sourceId = edge.source().id()
    const targetData = data[targetId]

    if (targetData.type === 'Destination') {
        return
    }

    // It must be a processing node of some kind.
    switch (targetData.definition.title) {
    case 'Cross-Fade': {
        const mix = targetData.properties.mix
        const input0Id = inputIdFromGraphNodeAtPosition(targetData, 0)
        const input1Id = inputIdFromGraphNodeAtPosition(targetData, 1)

        let opacity
        if (sourceId === input0Id) {
            opacity = 1 - mix
        } else if (sourceId === input1Id) {
            opacity = mix
        } else {
            // Unlikely - this must be a CompositingNode. Weird situation but
            // it's correct to set opacity to zero as transition shader sets
            // everything other than inputs 0 and 1 to pure alpha.
            opacity = 0
        }
        edge.style('opacity', opacity)
        return
    }
    case 'Opacity': {
        edge.style('opacity', targetData.properties.opacity)
        return
    }
    default: {
        return
    }
    }
}

const formatTransitionInfo = transition => `Start: ${transition.start}s, value ${transition.current}. End: ${transition.end}s, value ${transition.target}`

const formatTransitions = props => {
    const transitions = props.transitions
    switch (props.definition.title) {
    case 'Cross-Fade':
        return transitions.mix.map(formatTransitionInfo).join('\n')
    case 'Opacity':
        return transitions.opacity.map(formatTransitionInfo).join('\n')
    default:
        // We haven't set any special formatting for this shader so just nicely
        // format the raw transitions info.
        return stringify(props.transitions)
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
        return `CompositingNode\nDefinition: ${props.definition.title}\nState: ${stringify(props.properties)}`
    case 'TransitionNode':
        const transitionsString = formatTransitions(props)
        return `TransitionNode\nDefinition: ${props.definition.title}\nState: ${stringify(props.properties)}\nTransitions:\n${transitionsString}`
    case 'EffectNode':
        return `EffectNode\nDefinition: ${props.definition.title}\nState: ${stringify(props.properties)}`
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
