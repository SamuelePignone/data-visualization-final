import React, { useState, useEffect, useRef } from 'react';
import { FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { extendedColorScheme } from './Config';
import { BarList, BarListSeries } from 'reaviz';

const AnimationControl = ({ start, end, year, onYearChange, isActive, setIsActive, text }) => {
    const [currentYear, setCurrentYear] = useState(year);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Ensure the external state is updated when currentYear changes
        onYearChange(currentYear);
    }, [currentYear]);

    const play = () => {
        setIsActive(true);
        setCurrentYear(start);
        intervalRef.current = setInterval(() => {
            setCurrentYear(prevYear => {
                const nextYear = prevYear + 1;
                if (nextYear > end) {
                    clearInterval(intervalRef.current);
                    setIsActive(false);
                    return prevYear;
                }
                return nextYear;
            });
        }, 1000);
    };

    const stop = () => {
        clearInterval(intervalRef.current);
        setIsActive(false);
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className='w-full flex flex-col justify-center items-center mt-4'>
            {isActive ? (
                <>
                    <p>Year: {currentYear}</p>
                    <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p className='mr-3 font-bold'>{start}</p>
                        <BarList
                            style={{ width: 350 }}
                            data={[{
                                key: "",
                                data: (currentYear - start) * 100 / (end - start)
                            }]}
                            series={
                                <BarListSeries
                                    colorScheme={[extendedColorScheme[0]]}
                                    barClassName="bar" 
                                    outerBarClassName="outer" 
                                    valueClassName="value" 
                                />
                            }
                            type='percent'
                        />
                        <p className='ml-3 font-bold'>{end}</p>
                    </div>
                    <div onClick={stop} className=''>
                        <FaCircleStop className='text-3xl cursor-pointer' />
                    </div>
                </>
            ) : (
                <>
                    <div onClick={play} className=''>
                        <FaCirclePlay className='text-3xl cursor-pointer' />
                    </div>
                    <p className='mt-2'>{text}</p>
                </>
            )}
        </div>
    );
};

export default AnimationControl;
