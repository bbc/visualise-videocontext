import cytoscape from 'cytoscape'
import cydagre from 'cytoscape-dagre'
import { createNode, setNodeLabel, animateNodeChange } from './utils.js'

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

    setNodes (data) {
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

    setEdges (data) {
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

    setValues (data) {
        this.setNodes(data)
        this.setEdges(data)
        const edges = this._cy.$(ele => ele.isEdge())
        edges.forEach(edge => {
            setEdgeColours(edge, data)
        })
    }
}

const inputIdFromGraphNodeAtPosition = (node, i) => node.inputs[i] ? node.inputs[i].id : null

function setEdgeColours (edge, data) {
    // const rules = [
    //     (edge, data) =>
    // ]
    const targetId = edge.target().id()
    const sourceId = edge.source().id()
    const targetData = data[targetId]
    // const sourceData = data[sourceId]
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
