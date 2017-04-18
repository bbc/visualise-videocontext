const videoNode = (id, props) => ({
    data: {
        id: id,
    },
    classes: 'VideoNode',
    style: {
        label: `VideoNode\n${props.url}\nstart: ${props.start}\nstop: ${props.stop}`,
    },
})

const compositingNode = (id, props) => ({
    data: {
        id: id,
    },
    classes: 'CompositingNode',
    style: {
        label: `CompositingNode\nDefinition: ${props.definition.title}`,
    },
})

const destinationNode = (id, props) => ({
    data: {
        id: id,
    },
    style: {
        label: 'DestinationNode',
    },
    classes: 'DestinationNode',
})

const createNode = (id, props) => {
    switch (props.type) {
    case 'VideoNode':
        return videoNode(id, props)
    case 'CompositingNode':
        return compositingNode(id, props)
    case 'Destination':
        return destinationNode(id, props)
    default:
        throw new Error('Unknown node type')
    }
}

export default createNode
