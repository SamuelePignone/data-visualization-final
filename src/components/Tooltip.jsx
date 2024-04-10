import React from 'react';
import { colorScheme } from './Config';

const Tooltip = ({ content, style, className, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div
            className={`absolute bg-white border border-gray-300 shadow-lg p-2 rounded-md text-blue-300 ${className}`}
            style={{
                opacity: 0.9,
                display: 'block',
                //color: colorScheme[0],
                ...style,
            }}
        >
            {content}
        </div>
    );
};

export default Tooltip;
