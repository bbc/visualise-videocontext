import cytoscape from 'cytoscape'
import cydagre from 'cytoscape-dagre'
import { createNode, animateNodeChange } from './utils.js'
import { setEdgeColours, setNodeColours, setNodeLabel } from './style.js'

cydagre(cytoscape)

export default class VideoContextVisualisation {
    constructor (div) {
        this._cy = cytoscape({
            container: div,
            elements: [],
            style: [ // the stylesheet for the graph
                {
                    selector: '.VideoNode,.ImageNode',
                    style: {
                        'background-color': '#F00',
                    },
                },
                {
                    selector: '.TransitionNode,.CompositingNode,.EffectNode',
                    style: {
                        'background-color': '#00F',
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
                        'width': 5,
                        'line-color': '#000',
                        'mid-target-arrow-color': '#000',
                        'mid-target-arrow-shape': 'triangle',
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
        this._cy.minZoom(this._cy.zoom())
    }

    _setNodes (data) {
        Object.keys(data).forEach(id => {
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
        Object.keys(data).forEach(id => {
            const props = data[id]
            if (props.inputs) {
                props.inputs.forEach(inp => {
                    const edgeId = `${id}_${inp.id}`
                    if (this._cy.getElementById(edgeId).length === 0) {
                        this._cy.add({ data: {
                            id: `${id}_${inp.id}`,
                            source: inp.id,
                            target: id,
                        }})
                    }
                })
            }
        })
    }

    setData (data) {
        if (typeof data === 'string') {
            data = JSON.parse(data)
        }
        this._setNodes(data)
        this._setEdges(data)
        const edges = this._cy.$(ele => ele.isEdge())
        edges.forEach(edge => {
            setEdgeColours(edge, data)
        })

        const nodes = this._cy.$(ele => ele.isNode())
        nodes.forEach(node => {
            setNodeColours(node, data)
        })
    }
}
