// @flow

export type NodeData = {
    inputs: Array<string>,
    meta: Object
}

export type Data = {
    global: Object,
    nodes: Map<string, NodeData>
}
