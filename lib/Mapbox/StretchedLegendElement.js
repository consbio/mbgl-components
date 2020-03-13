import React from 'react'

export default ({ colors, labels }) => (
    <div className="legend-element stretched">
        <div
            className="legend-symbol stretched-symbol"
            style={{background: `linear-gradient(${colors[0]}, ${colors[1]})`}}
        />
        <div className="legend-label">
            <div className="label-top">{labels[0]}</div>
            <div className="label-bottom">{labels[1]}</div>
        </div>
    </div>
)


