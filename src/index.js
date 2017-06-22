import cytoscape from 'cytoscape'
import cydagre from 'cytoscape-dagre'
import { createNode, animateNodeChange } from './utils.js'
import { setEdgeColours, setNodeColours, setNodeLabel } from './style.js'

cydagre(cytoscape)

export default class VideoContextVisualisation {
    constructor (div, colours = {}) {
        this._colours = {
            active: colours.active || '#0F0',
            inactive: colours.inactive || '#0D0',
            processing: colours.processing || '#F0F',
            error: colours.error || '#F00',
            destination: colours.destination || '#000',
        }
        this._cy = cytoscape({
            container: div,
            elements: [],
            style: [ // the stylesheet for the graph
                {
                    selector: '.TransitionNode,.CompositingNode,.EffectNode',
                    style: {
                        'background-color': this._colours.processing,
                    },
                },
                {
                    selector: '.Destination',
                    style: {
                        'background-color': this._colours.destination,
                    },
                },
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
                        'width': 7,
                        'line-color': '#000',
                        'mid-target-arrow-color': '#000',
                        'mid-target-arrow-shape': 'triangle',
                    },
                },
                {
                    selector: 'node',
                    style: {
                        'width': 50,
                        'height': 50,
                    },
                },
            ],
        })
    }

    render () {
        this._cy.elements().layout({
            name: 'dagre',
            rankDir: 'LR',
        }).run()
        this._cy.minZoom(0)
        this._cy.fit()
        this._cy.minZoom(this._cy.zoom())
    }

    _setNodes (data) {
        const desiredNodeIds = Object.keys(data)

        // Delete nodes that no longer exist
        const unwantedNodes = this._cy.nodes().filter(node => !desiredNodeIds.includes(node.id()))
        unwantedNodes.remove()

        // Add/update remaining nodes
        desiredNodeIds.forEach(id => {
            const props = data[id]
            let ele = this._cy.getElementById(id)
            if (ele.length === 0) {
                ele = this._cy.add(createNode(id, props))
            }
            const didUpdate = setNodeLabel(ele, props)
            if (didUpdate) {
                animateNodeChange(ele)
            }
        })
    }

    _setEdges (data) {
        const createEdgeId = (fromId, toId) => `${fromId}_${toId}`

        // Parse the videocontext data
        const desiredEdges = []
        Object.keys(data).forEach(id => {
            const props = data[id]
            if (props.inputs) {
                props.inputs.forEach(inp => {
                    desiredEdges.push({
                        from: inp.id,
                        to: id,
                    })
                })
            }
        })

        // Delete edges that no longer exist
        const desiredEdgeIds = desiredEdges.map(edgeData => createEdgeId(edgeData.from, edgeData.to))
        const unwantedEdges = this._cy.edges().filter(edge => !desiredEdgeIds.includes(edge.id()))
        unwantedEdges.remove()

        // Add edges that need creating
        desiredEdges.forEach(edgeData => {
            const edgeId = `${edgeData.from}_${edgeData.to}`
            if (this._cy.getElementById(edgeId).length === 0) {
                this._cy.add({ data: {
                    id: edgeId,
                    source: edgeData.from,
                    target: edgeData.to,
                }})
            }
        })
    }

    setData (data) {
        if (typeof data === 'string') {
            data = JSON.parse(data)
        }
        const nodes = data.nodes

        this._setNodes(nodes)
        this._setEdges(nodes)
        const edges = this._cy.$(ele => ele.isEdge())
        edges.forEach(edge => {
            setEdgeColours(edge, nodes)
        })

        const renderedNodes = this._cy.$(ele => ele.isNode())
        renderedNodes.forEach(renderedNode => {
            setNodeColours(renderedNode, nodes, this._colours)
        })
    }

    destroy () {
        this._cy.destroy()
    }
}
