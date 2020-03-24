import React from 'react'
import { MapContext, SourceContext } from './context'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'

export default class TileSource extends React.Component {
    static contextType = MapContext

    static propTypes = {
        url: PropTypes.string.isRequired,
        attribution: PropTypes.string,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        subdomains: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    }

    static defaultProps = {
        attribution: null,
        minZoom: 0,
        maxZoom: 18,
        subdomains: []
    }

    constructor(props) {
        super(props)

        this.id = 'tilesource_' + uuid4()
    }

    componentWillUnmount() {
        const { style } = this.context

        delete style.sources[this.id]
    }

    update(map, style, updateStyle) {
        const { url, minZoom, maxZoom, attribution } = this.props

        let { subdomains } = this.props
        if (!Array.isArray(subdomains)) {
            subdomains = [subdomains]
        }

        style.sources[this.id] = {
            type: 'raster',
            tiles: subdomains.length > 0 ? subdomains.map(subdomain => url.replace('{s}', subdomain)) : [url],
            minzoom: minZoom,
            maxzoom: maxZoom,
            tileSize: 256,
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
                    return <SourceContext.Provider value={{ source: this.id, map, style, updateStyle }}>
                        {children}
                    </SourceContext.Provider>
                }}
            </MapContext.Consumer>
        )
    }
}
