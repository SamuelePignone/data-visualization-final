import React, { useState, useEffect, useRef } from 'react';
import { FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { getColor } from './Config';
import { BarList, BarListSeries } from 'reaviz';

const AnimationControl = ({ start, end, onYearChange, isActive, setIsActive, text }) => {
    const [currentYear, setCurrentYear] = useState(start);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Ensure the external state is updated when currentYear changes
        onYearChange(currentYear);
    }, [currentYear, onYearChange]);

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
        <div className='w-full flex flex-col justify-center items-center'>
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
                                    colorScheme={['#a50f15']}
                                    barClassName="bar" outerBarClassName="outer" valueClassName="value" valuePosition="end"
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
