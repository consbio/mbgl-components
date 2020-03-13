import React from 'react'
import PropTypes from 'prop-types'
import uuid4 from 'uuid/v4'
import { SourceContext } from './context'

export default class LineLayer extends React.Component {
    static contextType = SourceContext

    static propTypes = {
        index: PropTypes.number,
        interactive: PropTypes.bool,
        onTouchStart: PropTypes.func,
        onTouchEnd: PropTypes.func,
        onClick: PropTypes.func,
        name: PropTypes.string,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        color: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        blur: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        filter: PropTypes.array,
        id: PropTypes.string
    }

    static defaultProps = {
        index: null,
        interactive: true,
        onTouchStart: () => null,
        onTouchEnd: () => null,
        onClick: () => null,
        name: undefined,
        minZoom: 0,
        maxZoom: 18,
        opacity: 1,
        color: '#000000',
        width: 1,
        blur: 0,
        filter: null,
        id: null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.id !== this.props.id) {
            const {map, style} = this.context

            this.eventHandlers.forEach(([event, layer, fn]) => map.off(event, layer, fn))

            style.layers = style.layers.filter(layer => layer.id !== prevState.id)

            const id = this.props.id || 'linelayer_' + uuid4()
            this.setState({ id })
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            id: props.id || 'linelayer_' + uuid4()
        }
        this.eventHandlers = []
    }

    componentWillUnmount() {
        const { map, style } = this.context

        this.eventHandlers.forEach(([event, layer, fn]) => map.off(event, layer, fn))

        style.layers = style.layers.filter(layer => layer.id !== this.state.id)
    }

    update(source, map, style) {
        const { index, name, minZoom, maxZoom, opacity, color, width, blur, filter } = this.props

        const layer = {
            id: this.state.id,
            source: source,
            type: 'line',
            minzoom: minZoom,
            maxzoom: maxZoom,
            paint: {
                'line-opacity': opacity,
                'line-color': color,
                'line-width': width,
                'line-blur': blur
            }
        }

        if (name !== undefined) {
            layer['source-layer'] = name
        }

        if (filter !== null) {
            layer.filter = filter
        }

        const existingLayer = style.layers.find(layer => layer.id === this.state.id)
        if (existingLayer) {
            const layers = style.layers.filter(item => item.id !== this.state.id)
            style.layers = [...layers.slice(0, index), layer, ...layers.slice(index)]
        }
        else {
            style.layers = [...style.layers.slice(0, index), layer, ...style.layers.slice(index)]

            map.on('touchstart', this.state.id, this.onTouchStart)
            this.eventHandlers.push(['touchstart', this.state.id, this.onTouchStart])

            map.on('touchend', this.state.id, this.onTouchEnd)
            this.eventHandlers.push(['touchend', this.state.id, this.onTouchEnd])

            map.on('click', this.state.id, this.onClick)
            this.eventHandlers.push(['click', this.state.id, this.onClick])
        }
    }

    onTouchStart = (e) => {
        const { onTouchStart, interactive } = this.props
        const { map } = this.context

        if (!interactive) {
            return
        }

        onTouchStart(e, map)
    }

    onTouchEnd = (e) => {
        const { onTouchEnd, interactive } = this.props
        const { map } = this.context

        if (!interactive) {
            return
        }

        onTouchEnd(e, map)
    }

    onClick = (e) => {
        const { onClick, interactive } = this.props
        const { map } = this.context

        if (!interactive) {
            return
        }

        onClick(e, map)
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
