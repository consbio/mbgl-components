import React from 'react'

export default ({ color = null, image = null, children }) => {
    let symbol
    if (color !== null) {
        symbol = <div className="legend-symbol color-symbol" style={{backgroundColor: color}}></div>
    }
    else {
        symbol = <div className="legend-symbol image-symbol"><img src={image} alt="Legend symbol" /></div>
    }

    return (
        <div className="legend-element">
            {symbol}
            <div className="legend-label">
                {children}
            </div>
        </div>
    )
}


