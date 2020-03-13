import React from 'react'

export default ({ title, children }) => (
    <div className="legend-layer">
        <h5 className="title is-5">{title}</h5>
        {children}
    </div>
)
