import React from 'react'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'
import { MapContext, SourceContext } from './context'

export default class GeoJSONSource extends React.Component {
    static propTypes = {
        data: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]).isRequired,
        attribution: PropTypes.string,
        maxZoom: PropTypes.number,
        minZoom: PropTypes.number,
        buffer: PropTypes.number,
        tolerance: PropTypes.number,
        cluster: PropTypes.bool,
        clusterRadius: PropTypes.number,
        clusterMaxZoom: PropTypes.number,
        clusterProperties: PropTypes.shape({}),
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    }

    static defaultProps = {
        attribution: '',
        maxZoom: 18,
        buffer: 128,
        tolerance: 0.375,
        cluster: false,
        clusterRadius: 50,
        clusterMaxZoom: undefined,
        clusterProperties: undefined,
        children: []
    }

    constructor(props) {
        super(props)

        this.id = `geojsontilesource_${uuid4()}`
    }

    componentWillUnmount() {
        const { map, style } = this.context

        if (style === undefined) {
            return
        }

        delete style.sources[this.id]

        if (map !== null) {
            map.setStyle(style)
        }
    }

    update(map, style) {
        const {
            data,
            minZoom,
            maxZoom,
            attribution,
            buffer,
            tolerance,
            cluster,
            clusterRadius,
            clusterMaxZoom,
            clusterProperties
        } = this.props

        const source = {
            type: 'geojson',
            data,
            maxzoom: maxZoom,
            attribution,
            buffer,
            tolerance,
            cluster,
            clusterRadius,
        }
        if (clusterMaxZoom !== undefined) {
            source.clusterMaxZoom = clusterMaxZoom
        }
        if (clusterProperties !== undefined) {
            source.clusterProperties = clusterProperties
        }

        style.sources[this.id] = source
    }

    render() {
        const { children } = this.props
        return (
            <MapContext.Consumer>
                {({ map, style }) => {
                    if (map) {
                        this.update(map, style)
                    }
                    return (
                        <SourceContext.Provider value={{ source: this.id, map, style }}>
                            {children}
                        </SourceContext.Provider>
                    )
                }}
            </MapContext.Consumer>
        )
    }
}
