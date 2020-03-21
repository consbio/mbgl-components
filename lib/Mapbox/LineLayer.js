import React from 'react'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'
import LayerComponent from './LayerComponent'
import { SourceContext } from './context'

export default class LineLayer extends LayerComponent {
    static contextType = SourceContext

    static propTypes = {
        ...LayerComponent.propTypes,
        name: PropTypes.string,
        opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        color: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        blur: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        filter: PropTypes.array
    }

    static defaultProps = {
        ...LayerComponent.defaultProps,
        name: undefined,
        opacity: 1,
        color: '#000000',
        width: 1,
        blur: 0,
        filter: null
    }

    constructor(props) {
        super(props)

        this.id = 'linelayer_' + uuid4()
    }

    getLayerConfig() {
        const { name, opacity, color, width, blur, filter } = this.props
        const config = {
            type: 'line',
            paint: {
                'line-opacity': opacity,
                'line-color': color,
                'line-width': width,
                'line-blur': blur
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
