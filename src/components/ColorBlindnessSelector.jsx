import React, { useContext, useState, useEffect } from 'react';
import { ColorBlindnessContext } from './ColorBlindnessContext';
import { FaEyeLowVision } from "react-icons/fa6";

const ColorBlindnessSelector = () => {
    const { blindnessMode, setBlindnessModeState } = useContext(ColorBlindnessContext);
    const [isOpen, setIsOpen] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    let tooltipTimeout;

    const handleBlindnessChange = (event) => {
        setBlindnessModeState(event.target.value);
        // refresh the page to apply the new color scheme
        window.location.reload();
    };

    useEffect(() => {
        const firstPlot = document.getElementById('firstplot');
        if (firstPlot) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('In view');
                        setTimeout(() => {
                            setTooltipVisible(true);
                            tooltipTimeout = setTimeout(() => setTooltipVisible(false), 10000); // Hide after 20 seconds
                        }, 3000); // Show after 5 seconds of being in view
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(firstPlot);

            return () => {
                if (firstPlot) {
                    observer.unobserve(firstPlot);
                }
                clearTimeout(tooltipTimeout);
            };
        }
    }, []);

    const handleMouseEnter = () => {
        clearTimeout(tooltipTimeout);
        setTimeout(() => {
            setTooltipVisible(false);
        }, 2000);
    };

    return (
        <>
            <div
                className='cursor-pointer fixed left-10 bottom-10 z-[9999999] rounded-full w-14 h-14 bg-white flex justify-center items-center text-center shadow-md'
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={handleMouseEnter}
            >
                <FaEyeLowVision className='text-3xl text-[#3c70aa]' />
                {tooltipVisible && (
                    <div className="relative">
                        <p className="absolute flex items-center justify-center w-48 p-3 text-gray-600 bg-white rounded-lg shadow-lg -left-10 -top-48">
                            <span className="">Do you have problems seeing this plot? Try changing the color scheme based on your color blindness.</span>

                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 absolute rotate-45 left-4 bottom-0.5 -mb-3 transform text-white fill-current" stroke="currentColor" viewBox="0 0 24 24" >
                                <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path>
                            </svg>
                        </p>
                    </div>
                )}
            </div>
            <div
                className="fixed left-[4.25rem] bottom-10 z-[999999] bg-gray-100 shadow-md h-14"
                style={{ display: isOpen ? 'block' : 'none' }}
                onMouseEnter={handleMouseEnter}
            >
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
                    <div className='absolute right-0 z-[9999] w-14 h-14 rounded-full translate-x-1/2 bg-white'></div>
                </div>
            </div>
        </>
    );
};

export default ColorBlindnessSelector;
