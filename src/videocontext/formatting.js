// @flow

import { getOrThrow } from '../utils'
import createLabel from './createLabel'
import type { Data, NodeData } from '../types'

export const setNodeLabel = (nodeId: string, data: Data): string => {
    const nodeData = getOrThrow(data.nodes, nodeId)
    return createLabel(nodeData.meta)
}

export const styleNode = (cyNode: any, nodeId: string, data: Data): void => {
    const nodeData: NodeData = getOrThrow(data.nodes, nodeId)

    const colours = {
        active: '#0F0',
        inactive: '#0D0',
        processing: '#F0F',
        error: '#F00',
        destination: '#000',
    }
    let nodeColour
    switch (nodeData.meta.type) {
    case 'Destination':
        nodeColour = colours.destination
        break
    case 'TransitionNode':
    case 'CompositingNode':
    case 'EffectNode':
        nodeColour = colours.processing
        break
    default: {
        if (nodeData.meta.state) {
            const stateStyle = {
                waiting: colours.inactive,
                sequenced: colours.inactive,
                playing: colours.active,
                paused: colours.active,
                ended: colours.inactive,
                error: colours.error,
            }
            nodeColour = stateStyle[nodeData.meta.state]
        } else {
            nodeColour = colours.destination
        }
        break
    }
    }
    cyNode.style('background-color', nodeColour)
}

export const styleEdge = (
    cyEdge: any,
    from: string,
    to: string,
    data: Data
) => {
    const toNode = data.nodes.get(to)
    if (toNode == null) {
        throw new Error('Programming error - expected to find node')
    }

    if (toNode.meta.type === 'Destination') {
        return
    }

    // It's not a Destination, so it must be a processing node of some kind.
    if (toNode.meta.definition.title === 'Opacity') {
        cyEdge.style('opacity', toNode.meta.properties.opacity)
        return
    }

    if (toNode.meta.properties.mix != null && toNode.inputs.length === 2) {
        // It must be a node that can 'mix' between two sources. We can set
        // our edge's opacity based on the value of this mix.
        const mix = toNode.meta.properties.mix

        // Tells us which input of the 'to' node we're connected to.
        const inputNumber = toNode.inputs.findIndex(id => id === from)
        if (inputNumber === -1) {
            throw new Error(`Expected to find an entry with id ${from}`)
        }

        let opacity
        if (inputNumber === 0) {
            opacity = 1 - mix
        } else if (inputNumber === 1) {
            opacity = mix
        } else {
            // Unlikely - this must be a CompositingNode. Weird situation but
            // it's correct to set opacity to zero as transition shader sets
            // everything other than inputs 0 and 1 to pure alpha.
            opacity = 0
        }

        cyEdge.style('opacity', opacity)
        return
    }
}
