import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/cleaned_heatmap.json';
import { getColor } from '../Config';
import ColorLegend from '../ColorLegend';
import Tooltip from '../Tooltip';
import AnimationControl from '../AnimationControl';
import { mapstate, mapvalue } from '../MapState';
import YearSelector from '../YearSelector';
import Loader from '../Loader';

function Section3D3() {
    const [selectedYear, setSelectedYear] = useState("2023");
    const [availableYears, setAvailableYears] = useState(Object.keys(dataFile));
    const ref = useRef();
    const [dimensions, setDimensions] = useState({
        width: 900,
        height: 500,
        margin: { top: 5, right: 25, bottom: 30, left: 150 },
    });
    const [showDataPreparation, setShowDataPreparation] = useState(false);

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const [animation, setAnimation] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const states = dataFile[selectedYear].map(d => d.key);
        const activities = dataFile[selectedYear][0].data.map(d => d.key);

        const padding = 0.1;

        const x = d3.scaleBand()
            .range([0, dimensions.width])
            .domain(states)
            .padding(padding);

        const real_height = (padding * 2 * activities.length) + activities.length * x.bandwidth();

        const y = d3.scaleBand()
            .range([0, real_height])
            .domain(activities)
            .padding(padding);

        const svg = d3.select(ref.current)
            .append('svg')
            .attr('id', 'heatmap')
            .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr('height', real_height + dimensions.margin.top + dimensions.margin.bottom)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        svg.append('g')
            .attr("class", "x-axis")
            .attr('transform', `translate(0, ${real_height + 4})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll('text')
            .style('font-weight', "700")
            .style('font-size', "16px");

        svg.select('.x-axis').select('.domain').remove();

        svg.append('g')
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickSize(0))
            .selectAll('text')
            .style('font-size', "16px")
            .style('font-weight', "700");

        svg.select('.y-axis').select('.domain').remove();

        svg.selectAll()
            .data(dataFile[selectedYear], d => d.key)
            .enter()
            .append('g')
            .attr('class', 'col')
            .attr('transform', d => {
            return `translate(${x(d.key)}, 0)`
            })
            .selectAll()
            .data(d => d.data, d => d.key)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('x', d => {
            return x(d.key)
            })
            .attr('y', d => y(d.key))
            .attr('width', x.bandwidth())
            .attr('height', y.bandwidth())
            .style('fill', d => getColor(d.data))
            .style('stroke-width', 0.8)
            .style('stroke', 'white')
            .style('filter', 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))');

        setLoading(false);
    }, []);

    useEffect(() => {
        const svg = d3.select(ref.current).select('svg').select('g');

        svg.selectAll('.col')
            .data(dataFile[selectedYear], d => d.key)
            .selectAll('.cell')
            .data(d => d.data, d => d.key)
            .on('mouseover', (event, d) => {
                setTooltipContent(`${d.key} in ${mapstate(d3.select(event.currentTarget.parentNode).datum().key)} (${d3.select(event.currentTarget.parentNode).datum().key}): <b>${mapvalue(d.data)}</b>`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
                setTooltipVisible(true);
            })
            .on('mouseout', () => {
                setTooltipVisible(false);
            })
            .transition()
            .duration(500)
            .style('fill', d => getColor(d.data));

    }, [selectedYear]);

    return (
        <>
            <div className='w-screen mt-10 plotsection'>
                <h1 className='plottitle'>Digital Participation of Individuals</h1>
                <p className='plotintro'>So, what do people in different countries do with the internet. Many things, in this heatmap we see the most common ones.</p>
                <div className='w-full flex justify-center items-center mb-6'>
                    <YearSelector yearList={availableYears} currentYear={selectedYear} setCurrentYear={setSelectedYear} />
                </div>
                {loading && (<Loader />)}
                <div className='flex justify-center items-center w-full h-full -ml-10' style={{ display: loading ? 'none' : 'flex' }}>
                    <div ref={ref} className='w-fit'></div>
                    <ColorLegend
                        orientation="vertical"
                        startLabel="100%"
                        endLabel="0%"
                    />
                </div>
                <Tooltip
                    content={<div dangerouslySetInnerHTML={{ __html: tooltipContent }} />}
                    isVisible={tooltipVisible}
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                />
                <div className='w-full flex flex-col justify-center items-center'>
                    <AnimationControl
                        start={2002}
                        end={2023}
                        year={selectedYear}
                        onYearChange={(currentYear) => setSelectedYear(currentYear)}
                        isActive={animation}
                        setIsActive={setAnimation}
                        text={'Start an animation from ' + '2002' + ' to ' + '2023'}
                    />
                </div>
                <p className='plotexpl'>In the heatmap above, it displays year by year in various European countries what people do ( eg. e-banking, e-news, social networks ...) using the Internet. <br />Showing how habits have changed over the years and in the most countries.</p>
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className={`${showDataPreparation ? 'h-[100px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                        <p id='explain-1' className='w-[80%] text-center mx-auto'>
                            For this chart, we used this <a href="https://doi.org/10.2908/ISOC_SK_CSKL_I" className='underline underline-offset-4 cursor-pointer'>dataset</a> also produced by eurostat. We modified it to get a <code>.json</code> file.<br />
                            Where we have the different years, as the outermost key, which contain the different countries which in turn contain the value for each activity done online.
                        </p>
                    </div>
                    <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
                </div>
            </div>
        </>
    );
}

export default Section3D3;
