import cytoscape from 'cytoscape'
import cydagre from 'cytoscape-dagre'
import createNode from './createNode.js'

cydagre(cytoscape)

export default class VideoContextVisualisation {
    constructor (div) {
        this._cy = cytoscape({
            container: div,
            elements: [],
            style: [ // the stylesheet for the graph
                {
                    selector: '.VideoNode',
                    style: {
                        'background-color': '#F00',
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
                        'width': 3,
                        'line-color': '#000',
                        'target-arrow-color': '#F0F',
                        'target-arrow-shape': 'triangle',
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
    }

    setValues (data) {
        const nodes = Object.keys(data).map(id => {
            return createNode(id, data[id])
        })

        const edges = []
        Object.keys(data).forEach(id => {
            const vals = data[id]
            if (vals.inputs) {
                vals.inputs.forEach(inp => {
                    edges.push({ data: {
                        id: `${id}_${inp.id}`,
                        source: inp.id,
                        target: id,
                    }})
                })
            }
        })
        this._cy.add([...nodes, ...edges])
    }
}
