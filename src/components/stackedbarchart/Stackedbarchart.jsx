import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Loader from '../Loader';
import dataFile from '../../data/Stacked_barchart.json';
import { colorScheme } from '../Config';
import Tooltip from '../Tooltip';
import { mapstate, mapvalue, mapindtype } from '../MapState';
import NationSelector from '../NationSelector';

function processData(data) {
    var processedData = [];
    var time_period_set = new Set(data.map(d => d.TIME_PERIOD));
    time_period_set.forEach(time_period => {
        var obj = {
            TIME_PERIOD: time_period
        };
        data.filter(d => d.TIME_PERIOD === time_period)
            .forEach(d => {
                obj[d.indic_is] = d.OBS_VALUE;
            });
        processedData.push(obj);
    });
    return processedData;
}


function StackedBarChart() {

    const ref = useRef()
    const [loading, setLoading] = useState(true)
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 500,
        margin: { top: 50, right: 250, bottom: 50, left: 100 },
    });

    const [size_emp, setSize_emp] = useState('0-9');
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);
    const [size_empList, setSizeEmpList] = useState([]);
    const [selectedGeo, setSelectedGeo] = useState("ES");

    const [showDataPreparation, setShowDataPreparation] = useState(false);


    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const container = d3.select(ref.current)
        const svg = container
            .append('svg')
            .style('margin', '0 auto')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

        console.log(dataFile)

        var data = dataFile.filter(d => d.geo === selectedGeo);
        data = data.filter(d => d.size_emp === size_emp);

        var processedData = processData(data);
        console.log(processedData)

        setLoading(false)
    }, [selectedGeo, size_emp])

    return (
        <>
            <div className='w-screen mt-24 mb-64 plotsection'>
                <h1 className='plottitle'>E-commerce engagement</h1>
                <p className='plotintro'>One of the most life-changing elements of digitization in recent years is definitely e-commerce.</p>
                <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                    <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                    <div ref={ref} className='w-fit flex items-center justify-center mt-4'></div>
                </div>
                {loading && <Loader />}
                <Tooltip
                    content={<div dangerouslySetInnerHTML={{ __html: tooltipContent }} />}
                    isVisible={tooltipVisible}
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                    className={'text-center'}
                />
                <p className='plotexpl'>Using this line chart we can see the differences in utilization between European countries and the growth of this activity in recent years.</p>
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className={`${showDataPreparation ? 'h-[100px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                        <p id='explain-1' className='w-[80%] text-center mx-auto'>
                            For this plot we used this <a href="https://doi.org/10.2908/ISOC_EC_IB20">dataset</a> from eurostat. We took the information regarding 3 age groups (16-24 years ,25-54 years, 55-74 years) and the average indicated in the dataset with <code>IND_TOTAL</code>. Aggregate data for the <code>"geo"</code> column such as <code>[EU27_2020]</code> were removed. <br />
                            Finally, we converted the file from .csv to .json as a matter of convenience.                            </p>
                    </div>
                    <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
                </div>
            </div>
        </>
    )
}

export default StackedBarChart;