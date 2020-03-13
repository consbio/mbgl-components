import React from 'react'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'
import { SourceContext } from './context'

export default class RasterLayer extends React.Component {
    static contextType = SourceContext

    static propTypes = {
        index: PropTypes.number,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        opacity: PropTypes.number
    }

    static defaultProps = {
        index: null,
        minZoom: 0,
        maxZoom: 18,
        opacity: 1
    }

    constructor(props) {
        super(props)

        this.id = 'tilelayer_' + uuid4()
    }

    componentWillUnmount() {
        const { style } = this.context

        style.layers = style.layers.filter(layer => layer.id !== this.id)
    }

    update(source, map, style) {
        const { index, minZoom, maxZoom, opacity } = this.props

        const layer = {
            id: this.id,
            source: source,
            type: 'raster',
            minzoom: minZoom,
            maxzoom: maxZoom,
            paint: {'raster-opacity': opacity || 1}
        }

        const existingLayer = style.layers.find(layer => layer.id === this.id)
        if (existingLayer) {
            const layers = style.layers.filter(item => item.id !== this.id)
            style.layers = [...layers.slice(0, index), layer, ...layers.slice(index)]
        }
        else {
            style.layers = [...style.layers.slice(0, index), layer, ...style.layers.slice(index)]
        }
    }

    render() {
        const { children } = this.props
        return (
            <SourceContext.Consumer>
                {({ source, map, style }) => {
                    if (map) {
                        this.update(source, map, style)
                    }
                    return children
                }}
            </SourceContext.Consumer>
        )
    }
}
