import React from 'react'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'
import LayerComponent from './LayerComponent'
import { SourceContext } from './context'

export default class HeatmapLayer extends LayerComponent {
    static contextType = SourceContext

    static propTypes = {
        ...LayerComponent.propTypes,
        name: PropTypes.string,
        opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        color: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        filter: PropTypes.array
    }

    static defaultProps = {
        ...LayerComponent.defaultProps,
        name: undefined,
        opacity: 1,
        color: '#000000',
        filter: null
    }

    constructor(props) {
        super(props)

        this.id = `heatmaplayer_${uuid4()}`
    }

    getLayerConfig() {
        const { name, opacity, color, filter, weight, intensity, radius } = this.props

        const config = {
            type: 'heatmap',
            paint: {
                'heatmap-opacity': opacity,
                'heatmap-color': color,
                'heatmap-weight': weight,
                'heatmap-intensity': intensity,
                'heatmap-radius': radius
            }
        }

        if (name !== undefined) {
            config['source-layer'] = name
        }

        if (filter !== null) {
            config.filter = filter
        }

        return config
    }
}
