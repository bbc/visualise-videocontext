import { breakLabelIntoLines, capitaliseFirstLetter } from './utils'

const rounded = num => Math.round(num * 100) / 100

const stringify = properties => (
    JSON.stringify(properties, (key, val) => (
        typeof val === 'number' ? rounded(val) : val
    ))
)

const stringifyTopLevelObject = properties => {
    const props = Object.keys(properties)
    const rows = props.map(prop => `${prop}: ${stringify(properties[prop])}`)
    return `{\n` + rows.join('\n') + `\n}`
}

const inputIdFromGraphNodeAtPosition = (node, i) => node.inputs[i] ? node.inputs[i].id : null

export function setEdgeColours (edge, data) {
    const targetId = edge.target().id()
    const sourceId = edge.source().id()
    const targetNode = data[targetId]

    if (targetNode.type === 'Destination') {
        return
    }
    // It's not a Destination, so it must be a processing node of some kind.

    if (targetNode.definition.title === 'Opacity') {
        edge.style('opacity', targetNode.properties.opacity)
        return
    }

    if (targetNode.properties.mix != null && targetNode.inputs.length === 2) {
        // It must be a node that can 'mix' between two sources. We can set
        // our edge's opacity based on the value of this mix.
        const mix = targetNode.properties.mix
        const input0Id = inputIdFromGraphNodeAtPosition(targetNode, 0)
        const input1Id = inputIdFromGraphNodeAtPosition(targetNode, 1)

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
}

export function setNodeColours (node, data, colours) {
    const nodeID = node.data().id
    const nodeData = data[nodeID]
    if (nodeData.state) {
        const stateStyle = {
            'waiting': colours.inactive,
            'sequenced': colours.inactive,
            'playing': colours.active,
            'paused': colours.active,
            'ended': colours.inactive,
            'error': colours.error,
        }
        node.style('background-color', stateStyle[nodeData.state])
    }
}

const formatTransitionInfo = transition => `Times: ${rounded(transition.start)}s-${rounded(transition.end)}s, Tweens: ${rounded(transition.current)}-${rounded(transition.target)}`

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
        return `VideoNode\n${breakLabelIntoLines(props.url, 25)}\n\nSTART: ${rounded(props.start)}\nSTOP: ${rounded(props.stop)}\nSTATE: ${capitaliseFirstLetter(props.state)}`
    case 'ImageNode':
        return `ImageNode\nURL:${breakLabelIntoLines(props.url, 25)}\n\nSTART: ${rounded(props.start)}\nSTOP: ${rounded(props.stop)}\nSTATE: ${capitaliseFirstLetter(props.state)}`
    case 'CanvasNode':
        return `CanvasNode\n\nSTART: ${rounded(props.start)}\nSTOP: ${rounded(props.stop)}\nSTATE: ${capitaliseFirstLetter(props.state)}`
    case 'CompositingNode':
        return `CompositingNode\nDEFINITION: ${props.definition.title}\n\nSTATE: ${stringifyTopLevelObject(props.properties)}`
    case 'TransitionNode':
        const transitionsString = formatTransitions(props)
        return `TransitionNode\nDEFINITION: ${props.definition.title}\n\nSTATE: ${stringifyTopLevelObject(props.properties)}\nTRANSITIONS:\n${transitionsString}`
    case 'EffectNode':
        return `EffectNode\nDEFINITION: ${props.definition.title}\n\nSTATE: ${stringifyTopLevelObject(props.properties)}`
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
