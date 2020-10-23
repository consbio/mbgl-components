import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import clone from 'clone-deep'
import equal from 'fast-deep-equal'
import { MapContext } from './context'
import { arraysAreEqual, objectFromEntries } from '../utils'

export default class Map extends React.Component {
    static propTypes = {
        bounds: PropTypes.array.isRequired,
        maxBounds: PropTypes.array,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        disableRotation: PropTypes.bool,

        onPan: PropTypes.func,
        onZoom: PropTypes.func,
        onZoomEnd: PropTypes.func
    }

    static defaultProps = {
        minZoom: 3,
        maxZoom: 16,
        maxBounds: null,
        disableRotation: false,
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
        const { minZoom, maxZoom, disableRotation, onPan, onZoom, onZoomEnd, bounds, maxBounds } = this.props

        this.map = new mapboxgl.Map({
            container: this.mapNodeRef.current,
            style: clone(this.style),
            minZoom,
            maxZoom,
            bounds,
            maxBounds,
            attributionControl: false
        })

        if (disableRotation) {
            this.map.dragRotate.disable()
            this.map.touchZoomRotate.disableRotation()
        }

        this.map.boxZoom.disable()
        this.map.addControl(new mapboxgl.AttributionControl(), 'bottom-left')

        this.map.on('styledata', () => {
            this.style = this.mergeStyles(this.style, this.map.getStyle())
        })

        this.map.on('moveend', () => {
            this.mapIsMoving = false
            this.enableInteraction()
            setTimeout(() => {
                if (!this.mapIsMoving) {
                    const bounds = this.map.getBounds().toArray()
                    onPan([...bounds[0], ...bounds[1]].map(val => parseFloat(val.toFixed(9))))
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
            const bounds = this.map.getBounds().toArray()

            this.enableInteraction()
            onZoomEnd(this.map.getZoom(), [...bounds[0], ...bounds[1]].map(val => parseFloat(val.toFixed(9))))
        })

        this.forceUpdate()
    }

    componentDidUpdate(prevProps) {
        const { bounds, maxBounds, disableRotation } = this.props
        if (!arraysAreEqual(prevProps.bounds, bounds)) {
            this.disableInteraction()
            this.map.fitBounds(bounds)
        }

        if (!arraysAreEqual(prevProps.maxBounds, maxBounds)) {
            this.map.setMaxBounds(maxBounds)
        }

        if (prevProps.disableRotation !== disableRotation) {
            if (disableRotation) {
                this.map.dragRotate.disable()
                this.map.touchZoomRotate.disableRotation()
            }
            else {
                this.map.dragRotate.enable()
                this.map.touchZoomRotate.enableRotation()
            }
        }
    }

    enableInteraction = () => {
        this.map.scrollZoom.enable()
    }

    disableInteraction = () => {
        this.map.scrollZoom.disable()
    }

    updateStyle = () => {
        this.styleUpdateTimeout = null
        if (this.map) {
            if (this.map.isStyleLoaded()) {
                const currentMapStyle = this.map.getStyle()

                if (equal(this.style, currentMapStyle, {strict: true})) {
                    return
                }
                this.style = this.mergeStyles(this.style, currentMapStyle)

                this.map.setStyle(clone(this.style))
            }
            else {
                this.styleUpdateTimeout = setTimeout(this.updateStyle, 10)
            }
        }
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
                                this.styleUpdateTimeout = setTimeout(this.updateStyle, 10)
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
