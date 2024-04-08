import React from 'react';
import { extendedColorScheme } from './Config';

const ColorLegend = ({ orientation = 'horizontal', startLabel = '', endLabel = '' }) => {
    const isHorizontal = orientation === 'horizontal';

    const colorScheme = isHorizontal ? extendedColorScheme : [...extendedColorScheme].reverse();

    return (
        <div style={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px 0',
        }}>
            {startLabel && <div style={{ margin: isHorizontal ? '0 10px 0 0' : '0 0 10px 0' }}>{startLabel}</div>}
            {
                colorScheme.map((color, index) => (
                    <div key={index} style={{
                        backgroundColor: color,
                        height: isHorizontal ? '20px' : '1.5px',
                        width: isHorizontal ? '5px' : '25px',
                        margin: isHorizontal ? '0 0px' : '0px 0',
                    }} />
                ))
            }
            {endLabel && <div style={{ margin: isHorizontal ? '0 0 0 10px' : '10px 0 0 0' }}>{endLabel}</div>}
        </div>
    );
};

export default ColorLegend;
