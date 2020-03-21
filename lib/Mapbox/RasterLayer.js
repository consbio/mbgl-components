import React from 'react'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'
import LayerComponent from './LayerComponent'
import { SourceContext } from './context'

export default class RasterLayer extends LayerComponent {
    static contextType = SourceContext

    static propTypes = {
        ...LayerComponent.propTypes,
        opacity: PropTypes.number
    }

    static defaultProps = {
        ...LayerComponent.defaultProps,
        opacity: 1
    }

    constructor(props) {
        super(props)

        this.id = 'rasterlayer_' + uuid4()
    }

    getLayerConfig() {
        const { opacity } = this.props

        return {
            type: 'raster',
            paint: {
                'raster-opacity': opacity || 1
            }
        }
    }
}
