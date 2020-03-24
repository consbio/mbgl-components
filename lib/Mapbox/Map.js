import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import clone from 'clone-deep'
import { MapContext } from './context'
import { arraysAreEqual, objectFromEntries } from '../utils'

export default class Map extends React.Component {
    static propTypes = {
        bounds: PropTypes.array.isRequired,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,

        onPan: PropTypes.func,
        onZoom: PropTypes.func,
        onZoomEnd: PropTypes.func
    }

    static defaultProps = {
        minZoom: 3,
        maxZoom: 16,
        onPan: () => {},
        onZoom: () => {},
        onZoomEnd: () => {}
    }

    static nextIndex = 0

    constructor(props) {
        super(props)

        this.mapNodeRef = React.createRef()

        this.map = null
        this.style = {
            version: 8,
            name: 'OPR CEQA',
            sources: {},
            layers: []
        }
        this.styleUpdateTimeout = null
        this.mapIsMoving = false
    }

    componentDidMount() {
        const { minZoom, maxZoom, onPan, onZoom, onZoomEnd, bounds } = this.props

        this.map = new mapboxgl.Map({
            container: this.mapNodeRef.current,
            style: clone(this.style),
            minZoom,
            maxZoom,
            bounds,
            attributionControl: false
        })

        this.map.boxZoom.disable()
        this.map.addControl(new mapboxgl.AttributionControl(), 'bottom-left')

        this.map.on('styledata', () => {
            this.style = this.mergeStyles(this.style, this.map.getStyle())
        })

        this.map.on('moveend', () => {
            this.mapIsMoving = false
            setTimeout(() => {
                if (!this.mapIsMoving) {
                    onPan(
                        this.map
                            .getBounds()
                            .toArray()
                            .flat()
                            .map(val => parseFloat(val.toFixed(9)))
                    )
                }
            }, 1)
        })

        this.map.on('movestart', () => {
            this.mapIsMoving = true
        })

        this.map.on('zoom', () => {
            onZoom()
        })

        this.map.on('zoomend', () => {
            onZoomEnd(
                this.map.getZoom(),
                Object.values(this.map.getBounds())
                    .map(bound => Object.values(bound))
                    .flat()
                    .map(val => parseFloat(val.toFixed(9)))
            )
        })

        this.forceUpdate()
    }

    componentDidUpdate(prevProps) {
        const { bounds } = this.props
        if (!arraysAreEqual(prevProps.bounds, bounds)) {
            this.map.fitBounds(bounds)
        }
    }

    updateStyle = () => {
        if (this.map) {
            if (this.map.isStyleLoaded()) {
                this.style = this.mergeStyles(this.style, this.map.getStyle())
            }
            
            this.map.setStyle(clone(this.style))
        }

        this.styleUpdateTimeout = null
    }

    mergeStyles = (oldStyle, newStyle) => {
        return Object.assign(oldStyle, {
            sources: {
                ...objectFromEntries(
                    Object.entries(oldStyle.sources).filter(([key]) => !key.startsWith('mapbox-gl-draw'))
                ),
                ...objectFromEntries(
                    Object.entries(newStyle.sources).filter(([key]) => key.startsWith('mapbox-gl-draw'))
                )
            },
            layers: [
                ...oldStyle.layers.filter(lyr => !lyr.id.startsWith('gl-draw')),
                ...newStyle.layers.filter(lyr => lyr.id.startsWith('gl-draw'))
            ]
        })
    }

    render() {
        const { children } = this.props
        Map.nextIndex = 0

        return (
            <div className="map-container">
                <div className="map-container" ref={this.mapNodeRef} />
                <MapContext.Provider
                    value={{
                        map: this.map,
                        style: this.style,
                        updateStyle: () => {
                            if (this.styleUpdateTimeout === null) {
                                this.styleUpdateTimeout = setTimeout(this.updateStyle, 1)
                            }
                        }
                    }}
                >
                    {children}
                </MapContext.Provider>
            </div>
        )
    }
}
