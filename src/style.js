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
