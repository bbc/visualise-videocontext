// @flow

export const getOrCreateNode = (cy: any, id: string) => {
    const cyNode = cy.getElementById(id)
    const nodeAlreadyExists = cyNode.length !== 0
    if (nodeAlreadyExists) {
        return cyNode
    } else {
        return cy.add({
            data: {
                id: id,
            },
        })
    }
}

export const createEdgeId = (fromId: string, toId: string) =>
    `${fromId}_${toId}`

export const getOrCreateEdge = (cy: any, from: string, to: string) => {
    const edgeId = createEdgeId(from, to)
    let cyEdge = cy.getElementById(edgeId)
    const edgeExists = cyEdge.length !== 0
    if (!edgeExists) {
        cyEdge = cy.add({
            data: {
                id: edgeId,
                source: from,
                target: to,
            },
        })
    }
    return cyEdge
}

export const animateNodeChange = (ele: any) => {
    ele.stop(true, false)
    ele.style('background-blacken', -1)
    ele.animate({
        style: {
            'background-blacken': 0,
        },
        duration: 500,
    })
}
