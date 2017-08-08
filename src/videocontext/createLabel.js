// @flow

import { breakLabelIntoLines, capitaliseFirstLetter } from '../utils'

const rounded = num => Math.round(num * 100) / 100

const stringify = properties =>
    JSON.stringify(
        properties,
        (key, val) => (typeof val === 'number' ? rounded(val) : val)
    )

const stringifyTopLevelObject = properties => {
    const props = Object.keys(properties)
    const rows = props.map(prop => `${prop}: ${stringify(properties[prop])}`)
    return `{\n` + rows.join('\n') + `\n}`
}

const formatTransitionInfo = transition =>
    `Times: ${rounded(transition.start)}s-${rounded(
        transition.end
    )}s, Tweens: ${rounded(transition.current)}-${rounded(transition.target)}`

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

const createLabel = (props: Object) => {
    switch (props.type) {
    case 'VideoNode':
        return `VideoNode\n${breakLabelIntoLines(
                props.url,
                25
            )}\n\nSTART: ${rounded(props.start)}\nSTOP: ${rounded(
                props.stop
            )}\nSTATE: ${capitaliseFirstLetter(props.state)}`
    case 'ImageNode':
        return `ImageNode\nURL:${breakLabelIntoLines(
                props.url,
                25
            )}\n\nSTART: ${rounded(props.start)}\nSTOP: ${rounded(
                props.stop
            )}\nSTATE: ${capitaliseFirstLetter(props.state)}`
    case 'CanvasNode':
        return `CanvasNode\n\nSTART: ${rounded(
                props.start
            )}\nSTOP: ${rounded(props.stop)}\nSTATE: ${capitaliseFirstLetter(
                props.state
            )}`
    case 'CompositingNode':
        return `CompositingNode\nDEFINITION: ${props.definition
                .title}\n\nSTATE: ${stringifyTopLevelObject(props.properties)}`
    case 'TransitionNode':
        const transitionsString = formatTransitions(props)
        return `TransitionNode\nDEFINITION: ${props.definition
                .title}\n\nSTATE: ${stringifyTopLevelObject(
                props.properties
            )}\nTRANSITIONS:\n${transitionsString}`
    case 'EffectNode':
        return `EffectNode\nDEFINITION: ${props.definition
                .title}\n\nSTATE: ${stringifyTopLevelObject(props.properties)}`
    case 'Destination':
        return 'Destination'
    default:
        return 'Unknown'
    }
}

export default createLabel
