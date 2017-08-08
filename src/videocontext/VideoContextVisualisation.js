// @flow

import Visualisation from '../Visualisation'

import parseVideoContextSnapshot from './parse'
import { styleNode, styleEdge, setNodeLabel } from './formatting'

export default class VideoContextVisualisation extends Visualisation {
    constructor (div: HTMLElement) {
        super(div)

        this.styleNode = styleNode
        this.styleEdge = styleEdge
        this.setNodeLabel = setNodeLabel
    }

    setData (data: any) {
        super.setData(parseVideoContextSnapshot(data))
    }
}
