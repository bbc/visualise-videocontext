// @flow

import cytoscape from 'cytoscape'
import cydagre from 'cytoscape-dagre'

import {
    animateNodeChange,
    getOrCreateNode,
    getOrCreateEdge,
    createEdgeId,
} from './cytoscapeUtils'

import type { Data } from './types'

cydagre(cytoscape)

export default class Visualisation {
    _div: HTMLElement
    _cy: any
    _styleNode: (cyNode: any, nodeId: string, data: Data) => void
    _styleEdge: (cyEdge: any, fromId: string, toId: string, data: Data) => void
    _setNodeLabel: (nodeId: string, data: Data) => string

    constructor (div: HTMLElement) {
        this._div = div
        this._cy = cytoscape({
            container: div,
            style: [
                {
                    selector: '*',
                    style: {
                        'text-wrap': 'wrap',
                        'font-family': 'monospace',
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 7,
                        'line-color': '#000',
                        'mid-target-arrow-color': '#000',
                        'mid-target-arrow-shape': 'triangle',
                    },
                },
                {
                    selector: 'node',
                    style: {
                        'background-color': '#000',
                        width: 50,
                        height: 50,
                    },
                },
            ],
        })

        this._styleNode = (node, nodeId, data) => {}
        this._styleEdge = (edge, fromNodeId, toNodeId, data) => {}
        this._setNodeLabel = (nodeId, data) => 'some label'
    }

    set styleNode (fn: (any, string, Data) => void) {
        this._styleNode = fn
    }

    set styleEdge (fn: (any, string, string, Data) => void) {
        this._styleEdge = fn
    }

    set setNodeLabel (fn: (string, Data) => string) {
        this._setNodeLabel = fn
    }

    _setNodes (data: Data) {
        const nodes = data.nodes
        const desiredNodeIds = [...nodes.keys()]

        // Delete nodes that no longer exist
        const unwantedNodes = this._cy
            .nodes()
            .filter(node => !desiredNodeIds.includes(node.id()))
        unwantedNodes.remove()

        // Add/update remaining nodes
        desiredNodeIds.forEach(id => {
            const cyNode = getOrCreateNode(this._cy, id)

            this._styleNode(cyNode, id, data)

            const oldLabel = cyNode.style('label')
            const newLabel = this._setNodeLabel(id, data)
            cyNode.style('label', newLabel)

            const didUpdate = oldLabel !== newLabel && oldLabel !== ''
            if (didUpdate) {
                animateNodeChange(cyNode)
            }
        })
    }

    _setEdges (data: Data) {
        const desiredEdges: Array<{ from: string, to: string }> = []
        data.nodes.forEach((node, id) => {
            node.inputs.forEach(inputId => {
                desiredEdges.push({ from: inputId, to: id })
            })
        })

        const desiredEdgeIds = desiredEdges.map(edgeInfo =>
            createEdgeId(edgeInfo.from, edgeInfo.to)
        )

        // Remove unwanted edges
        const unwantedEdges = this._cy
            .edges()
            .filter(edge => !desiredEdgeIds.includes(edge.id()))
        unwantedEdges.remove()

        // Add edges that need creating
        desiredEdges.forEach(({ from, to }) => {
            const cyEdge = getOrCreateEdge(this._cy, from, to)
            this._styleEdge(cyEdge, from, to, data)
        })
    }

    setData (data: Data) {
        this._setNodes(data)
        this._setEdges(data)
    }

    render () {
        const divAspectRatio = this._div.clientWidth / this._div.clientHeight
        this._cy
            .elements()
            .layout({
                name: 'dagre',
                rankDir: divAspectRatio > 1 ? 'LR' : 'TB',
            })
            .run()
        this._cy.minZoom(0)
        this._cy.fit()
        this._cy.minZoom(this._cy.zoom())
    }

    destroy () {
        this._cy.destroy()
    }
}
