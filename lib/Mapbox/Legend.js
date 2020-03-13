import React from 'react'

export default ({ active, children = null, onToggle }) => {
    if (children === null) {
        return null
    }

    return (
        <div className={`legend ${active ? 'active' : ''}`}>
            <div className="caret" />
            <h4 className="title is-4">
                <div
                    onClick={() => onToggle(!active)}
                    onKeyDown={e => (e.key === 'Enter' ? onToggle(!active) : null)}
                    role="button"
                    tabIndex="0"
                >
                    Legend
                </div>
            </h4>
            {children}
        </div>
    )
}
