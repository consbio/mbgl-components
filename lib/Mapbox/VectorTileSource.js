import React from 'react'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'
import { MapContext, SourceContext } from './context'

export default class VectorTileSource extends React.Component {
    static contextType = MapContext

    static propTypes = {
        url: PropTypes.string.isRequired,
        attribution: PropTypes.string,
        interactive: PropTypes.bool,
        maxZoom: PropTypes.number,
        minZoom: PropTypes.number
    }

    static defaultProps = {
        attribution: '',
        interactive: true,
        minZoom: 0,
        maxZoom: 18
    }

    constructor(props) {
        super(props)

        this.id = `vectortilesource_${uuid4()}`
    }

    componentWillUnmount() {
        const { style } = this.context

        delete style.sources[this.id]
    }

    update(map, style, updateStyle) {
        const { url, minZoom, maxZoom, attribution } = this.props

        style.sources[this.id] = {
            type: 'vector',
            url,
            minzoom: minZoom,
            maxzoom: maxZoom,
            attribution
        }

        updateStyle()
    }

    render() {
        const { children } = this.props
        return (
            <MapContext.Consumer>
                {({ map, style, updateStyle }) => {
                    if (map) {
                        this.update(map, style, updateStyle)
                    }
                    return (
                        <SourceContext.Provider value={{ source: this.id, map, style, updateStyle }}>
                            {children}
                        </SourceContext.Provider>
                    )
                }}
            </MapContext.Consumer>
        )
    }
}
