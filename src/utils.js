const stringify = properties => (
    JSON.stringify(properties, (key, val) => (
        val.toFixed ? Number(val.toFixed(2)) : val
    ))
)

export const createNode = (id, props) => ({
    data: { id },
    classes: props.type,
})

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
        console.log(props)
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
