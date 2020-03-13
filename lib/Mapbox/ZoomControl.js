import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { MapContext } from './context'

export default class ZoomControl extends React.Component {
    static propTypes = {
        position: PropTypes.string,
        className: PropTypes.string
    }

    static defaultProps = {
        position: 'top-left',
        className: null
    }

    constructor(props) {
        super(props)

        this.control = null
        this.className = null
        this.position = null
    }

    update(map) {
        const { position, className } = this.props
        if (this.control === null) {
            this.control = new mapboxgl.NavigationControl({showCompass: false, showZoom: true})
            map.addControl(this.control, position)
            this.position = position
        }
        else if (this.position !== position) {
            map.removeControl(this.control)
            map.addControl(this.control, position)
        }

        if (this.className !== className) {
            const container = this.control._container
            if (this.className !== null) {
                container.classList.remove(this.className)
            }
            container.classList.add(className)
            this.className = className
        }
    }

    render() {
        return (
            <MapContext.Consumer>
                {({ map }) => {
                    if (map) {
                        this.update(map)
                    }
                    return null
                }}
            </MapContext.Consumer>
        )
    }
}
