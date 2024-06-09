// ColorBlindnessContext.js
import React, { createContext, useState, useEffect } from 'react';
import { setBlindnessMode } from './Config'; // Import the setBlindnessMode function

export const ColorBlindnessContext = createContext();

export const ColorBlindnessProvider = ({ children }) => {
    const [blindnessMode, setBlindnessModeState] = useState(() => {
        const savedMode = localStorage.getItem('blindnessMode');
        return savedMode || 'normal';
    });

    useEffect(() => {
        localStorage.setItem('blindnessMode', blindnessMode);
        setBlindnessMode(blindnessMode); // Update the color scheme in config
    }, [blindnessMode]);

    return (
        <ColorBlindnessContext.Provider value={{ blindnessMode, setBlindnessModeState }}>
            {children}
        </ColorBlindnessContext.Provider>
    );
};
