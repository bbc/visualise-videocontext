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

    setEdgeColours (data) {
        const crossfadeNodeIds = Object.keys(data)
            .filter(id => {
                const props = data[id]
                const type = props.type
                if (type === 'TransitionNode' || type === 'EffectNode') {
                    return props.definition.title === 'Cross-Fade'
                }
                return false
            })

        crossfadeNodeIds.forEach(id => {
            const props = data[id]
            const mix = props.properties.mix

            const input0IsConnected = props.inputs.find(inp => inp.index === 0)
            if (input0IsConnected) {
                const input0Id = props.inputs.find(inp => inp.index === 0).id
                const input0Edge = this._cy.getElementById(`${id}_${input0Id}`)
                const input0Opacity = 1 - mix
                input0Edge.style('opacity', input0Opacity)
            }

            const input1IsConnected = props.inputs.find(inp => inp.index === 1)
            if (input1IsConnected) {
                const input1Id = props.inputs.find(inp => inp.index === 1).id
                const input1Edge = this._cy.getElementById(`${id}_${input1Id}`)
                const input1Opacity = mix
                input1Edge.style('opacity', input1Opacity)
            }
        })
    }

    setValues (data) {
        this.setNodes(data)
        this.setEdges(data)
        this.setEdgeColours(data)
    }
}
