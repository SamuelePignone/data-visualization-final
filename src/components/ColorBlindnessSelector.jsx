// ColorBlindnessSelector.js
import React, { useContext, useState } from 'react';
import { ColorBlindnessContext } from './ColorBlindnessContext';
import { FaE, FaEyeLowVision } from "react-icons/fa6";

const ColorBlindnessSelector = () => {
    const { blindnessMode, setBlindnessModeState } = useContext(ColorBlindnessContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleBlindnessChange = (event) => {
        setBlindnessModeState(event.target.value);
        // refresh the page to apply the new color scheme
        window.location.reload();
    };

    return (
        <>
            <div className='cursor-pointer fixed left-10 bottom-10 z-[9999999] rounded-full w-14 h-14 bg-white flex justify-center items-center tetx-center shadow-md' onClick={() => setIsOpen(!isOpen)}>
                <FaEyeLowVision className='text-3xl text-[#3c70aa]' />
            </div>
            <div className="fixed left-[4.25rem] bottom-10 z-[999999] bg-gray-100 shadow-md h-14" style={{ display: isOpen ? 'block' : 'none' }}>
                <div className='relative h-full w-full flex items-center p-4'>
                    <select
                        value={blindnessMode}
                        onChange={handleBlindnessChange}
                        className="z-[999999] ml-8 text-black block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="normal">Normal</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                        <option value="tritanopia">Tritanopia</option>
                        <option value="monochromacy">Monochromacy</option>
                    </select>
                    <div className='absolute right-0 z-[9999] w-14 h-14 rounded-full translate-x-1/2 bg-white'>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ColorBlindnessSelector;