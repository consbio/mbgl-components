import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { MapContext } from "./context"

export default class Popup extends React.Component {
    static propTypes = {
        location: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
        maxWidth: PropTypes.string
    }

    static defaultProps = {
        maxWidth: '240px'
    }

    constructor(props)  {
        super(props)

        this.popup = null
        this.map = null
        this.content = null
    }

    componentWillUnmount() {
        if (this.popup !== null) {
            this.popup.remove()
            this.popup = null
        }
    }

    update(map) {
        const { location, maxWidth, children } = this.props
        if (this.popup === null) {
            this.popup = new mapboxgl.Popup({maxWidth, closeButton: false, closeOnClick: false}).setLngLat(location)
            this.popup.addTo(map)
        }
        else {
            try {
                this.popup.setLngLat(location)
            } catch {
                return
            }
        }

        setTimeout(() => {
            if (this.content === null) {
                this.content = document.createElement('div')
            }

            if (this.popup !== null) {
                ReactDOM.render(<>{children}</>, this.content)
                this.popup.setDOMContent(this.content)
            }
        }, 1)
    }

    render() {
        return (
            <MapContext.Consumer>
                {({ map }) => {
                    if (map !== null) {
                        this.update(map)
                    }
                }}
            </MapContext.Consumer>
        )
    }
}
