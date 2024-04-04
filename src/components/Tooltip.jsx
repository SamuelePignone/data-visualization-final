import React from 'react';

const Tooltip = ({ content, style, className, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div
            className={`absolute bg-white border border-gray-300 shadow-lg p-2 rounded-md ${className}`}
            style={{
                opacity: 0.9,
                display: 'block',
                color: '#a50f15',
                ...style,
            }}
        >
            {content}
        </div>
    );
};

export default Tooltip;
