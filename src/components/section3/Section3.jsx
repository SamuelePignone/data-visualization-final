import React, { useState, useEffect, useRef } from 'react';
import { Heatmap, HeatmapSeries, BarList, ChartTooltip, TooltipTemplate, TooltipArea, HeatmapCell, SequentialLegend } from 'reaviz';
import * as d3 from 'd3';
import data_file from '../../data/cleaned_heatmap.json';
import { FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { mapstate, mapvalue } from './MapState';

function Section3() {
    const [dimensions, setDimensions] = useState({
        width: 1300,
        height: 400,
        margin: { top: 50, right: 30, bottom: 30, left: 60 },
    });
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("2023");
    const [availableYears, setAvailableYears] = useState([]);
    const [animation, setAnimation] = useState(false);
    const intervalRef = useRef(null);

    const play = () => {
        setAnimation(true);
        setSelectedYear(availableYears[0]);
        let index = 1;
        intervalRef.current = setInterval(() => {
            setSelectedYear(availableYears[index]);
            index++;
            if (index >= availableYears.length) {
                clearInterval(intervalRef.current);
                setAnimation(false);
            }
        }, 1000);
    }

    // stop the animation
    const stop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            setAnimation(false);
        }
    }

    useEffect(() => {
        setAvailableYears(Object.keys(data_file));
        setData(data_file[selectedYear]);
    }, [selectedYear]);

    var interpolator = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 1000]);

    // create a list of colors from 0 to 100
    var array_from_0_to_1000 = Array.from(Array(1001).keys());
    var colorScheme = array_from_0_to_1000.map(interpolator);

    return (
        <>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {availableYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <div style={{ margin: '55px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Heatmap
                    height={dimensions.height - dimensions.margin.top - dimensions.margin.bottom}
                    width={dimensions.width - dimensions.margin.left - dimensions.margin.right}
                    data={data}
                    series={
                        <HeatmapSeries
                            colorScheme={'Reds'}
                            emptyColor='#f5f5f5'
                            cell={
                                <HeatmapCell tooltip={
                                    <ChartTooltip
                                        content={d => (
                                            <>
                                                {`${d.data.x} in ${mapstate(d.data.key)}`}
                                                <br />
                                                {`${mapvalue(d.data.value)}`}
                                            </>
                                        )}
                                        style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}
                                    />
                                } />
                            }
                        />
                    }
                />
                <SequentialLegend
                    data={[{
                        key: 'Foo',
                        data: 100
                    }, {
                        key: 'Bar',
                        data: 0
                    }]}
                    style={{
                        height: '165px',
                        marginLeft: '10px'
                    }}
                    colorScheme={'Reds'} />
            </div>
            <div className='w-full flex flex-col justify-center items-center'>
                {
                    animation ? (
                        <>
                            <p>Year: {selectedYear}</p>
                            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <p className='mr-3 font-bold'>{availableYears[0]}</p>
                                <BarList
                                    style={{ width: 350 }}
                                    data={[{
                                        key: "",
                                        data: (selectedYear - availableYears[0]) * 100 / (availableYears.length - 1)
                                    }]}
                                    type='percent'
                                />
                                <p className='ml-3 font-bold'>{availableYears[availableYears.length - 1]}</p>
                            </div>
                            <div onClick={stop} className=''>
                                <FaCircleStop className='text-3xl cursor-pointer' />
                            </div>
                        </>
                    ) : (
                        <>
                            <p></p>
                            <div onClick={play} className=''>
                                <FaCirclePlay className='text-3xl cursor-pointer' />
                            </div>
                            <p className='mt-2'>Start an animation from 2002 to 2023</p>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default Section3