import React from 'react';
import { colorScheme, primaryColor } from './Config';

const Tooltip = ({ content, style, className, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div
            className={`absolute bg-white border border-gray-300 shadow-lg p-2 rounded-md font-semibold ${className}`}
            style={{
                opacity: 0.9,
                display: 'block',
                color: primaryColor,
                ...style,
            }}
        >
            {content}
        </div>
    );
};

export default Tooltip;
