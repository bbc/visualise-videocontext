// @flow

import type { Data, NodeData } from '../types'

const transformVideoContextNode = (nodeSnapshot: Object): NodeData => {
    const { inputs, ...meta } = nodeSnapshot

    return {
        inputs: inputs ? inputs.map(input => input.id) : [],
        meta: meta,
    }
}

const createNodeMap = (nodesSnapshot: Object) => {
    const nodeMap = new Map()
    Object.entries(nodesSnapshot).forEach(([id, nodeSnapshot]) => {
        // $FlowIgnore
        nodeMap.set(id, transformVideoContextNode(nodeSnapshot))
    })
    return nodeMap
}

const parseVideoContextSnapshot = (snapshot: Object): Data => ({
    global: snapshot.videoContext,
    nodes: createNodeMap(snapshot.nodes),
})

export default parseVideoContextSnapshot
