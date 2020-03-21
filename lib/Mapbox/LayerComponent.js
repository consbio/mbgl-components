import React from 'react'
import PropTypes from 'prop-types'
import { SourceContext } from './context'

const eventMap = {
    touchstart: 'onTouchStart',
    touchend: 'onTouchEnd',
    click: 'onClick',
    mousemove: 'onMouseMove',
    mouseleave: 'onMouseLeave'
}

export default class LayerComponent extends React.Component {
    static contextType = SourceContext

    static propTypes = {
        id: PropTypes.string,
        index: PropTypes.number,
        interactive: PropTypes.bool,
        onTouchStart: PropTypes.func,
        onTouchEnd: PropTypes.func,
        onClick: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseLeave: PropTypes.func,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number
    }

    static defaultProps = {
        id: null,
        index: null,
        interactive: true,
        onTouchStart: null,
        onTouchEnd: null,
        onClick: null,
        onMouseMove: null,
        onMouseLeave: null,
        minZoom: 0,
        maxZoom: 18
    }

    constructor(props) {
        super(props)

        this.state = {}
        this.eventHandlers = {}
    }

    componentDidUpdate() {
        const { id } = this.props

        if (id) {
            if (id !== this.state.id) {
                this.setState({ id })
            }
        }
        else {
            if (this.state.id !== this.id) {
                this.setState({ id: this.id })
            }
        }

    }

    componentDidMount() {
        const { id } = this.props
        this.setState({id: id || this.id})
    }

    componentWillUnmount() {
        const { map, style } = this.context
        const { id } = this.state

        Object.entries(this.eventHandlers).forEach(([event, [layer, fn]]) => map.off(event, layer, fn))
        this.eventHandlers = {}

        style.layers = style.layers.filter(layer => layer.id !== id)
    }

    getLayerConfig() {
        return {}
    }

    update(source, map, style) {
        const { index, interactive, minZoom, maxZoom } = this.props
        const { id } = this.state

        if (!id) {
            return
        }

        const layer = {
            id,
            source: source,
            minzoom: minZoom,
            maxzoom: maxZoom,
            ...this.getLayerConfig(source)
        }

        const existingLayer = style.layers.find(layer => layer.id === id)
        if (existingLayer) {
            const layers = style.layers.filter(item => item.id !== id)
            style.layers = [...layers.slice(0, index), layer, ...layers.slice(index)]
        }
        else {
            style.layers = [...style.layers.slice(0, index), layer, ...style.layers.slice(index)]
        }

        Object.entries(eventMap).forEach(([event, handler]) => {
            if (!interactive) {
                if (this.eventHandlers[event]) {
                    map.off(event, id, this[handler])
                    delete this.eventHandlers[event]
                }
                return
            }

            if (!!this.props[handler] !== !!this.eventHandlers[event]) {
                if (this.props[handler]) {
                    map.on(event, id, this[handler])
                    this.eventHandlers[event] = [id, this[handler]]
                }
                else if (this.eventHandlers[event]) {
                    map.off(event, id, this[handler])
                    delete this.eventHandlers[event]
                }
            }
        })
    }

    onTouchStart = e => {
        const { map } = this.context
        const { onTouchStart } = this.props

        if (onTouchStart) {
            onTouchStart(e, map)
        }
    }

    onTouchEnd = e => {
        const { map } = this.context
        const { onTouchEnd } = this.props

        if (onTouchEnd) {
            onTouchEnd(e, map)
        }
    }

    onClick = e => {
        const { map } = this.context
        const { onClick } = this.props

        if (onClick) {
            onClick(e, map)
        }
    }

    onMouseMove = e => {
        const { map } = this.context
        const { onMouseMove } = this.props

        if (onMouseMove) {
            onMouseMove(e, map)
        }
    }

    onMouseLeave = e => {
        const { map } = this.context
        const { onMouseLeave } = this.props

        if (onMouseLeave) {
            onMouseLeave(e, map)
        }
    }

    render() {
        const { children } = this.props

        return (
            <SourceContext.Consumer>
                {({ source, map, style }) => {
                    if (map) {
                        this.update(source, map, style)
                    }
                    return children
                }}
            </SourceContext.Consumer>
        )
    }
}
