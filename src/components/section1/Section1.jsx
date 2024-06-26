import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../Tooltip';
import { getColor } from '../Config';
import ColorLegend from '../ColorLegend';
import AnimationControl from '../AnimationControl';
import YearSelector from '../YearSelector';
import europemap from '../../map/europe_cleaned.json';
import Loader from '../Loader';

function Section1() {
    const ref = useRef();
    const [dimensions, setDimensions] = useState({
        width: 900,
        height: 500,
        margin: { top: 150, right: 25, bottom: 30, left: 100 },
    });
    const [accessData, setAccessData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("2023");
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(false);

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const [showDataPreparation, setShowDataPreparation] = useState(false);

    const explainHeight = document.getElementById('explain-1') ? document.getElementById('explain-1').clientHeight : 0;

    // Fetch the internet access data
    useEffect(() => {
        setLoading(true);
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = d3.select(ref.current)
            .append('svg')
            .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr('height', dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        const projection = d3.geoMercator()
            .center([20, 52])
            .scale(500)
            .translate([dimensions.width / 2, dimensions.height / 2]);
        const path = d3.geoPath().projection(projection);

        svg.selectAll('path')
            .data(europemap.features)
            .enter().append('path')
            .attr('d', path)
            .attr('stroke', 'white')
            .attr('fill', '#ccc')
            .attr('class', 'country');

        const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0rO63WLpPEEZHo6G3BiNj2ZRGlA_wppyVHxQJOpUhT8ZHNuYVmNNPrzTySOWF6r1fk_zswIYkRFXY/pub?gid=445652727&single=true&output=csv";

        d3.csv(dataUrl).then(data => {
            const processedData = data.map(row => {
                const processedRow = { country: row.country_codes };
                for (let year = 2002; year <= 2023; year++) {
                    processedRow[year.toString()] = +row[year.toString()].replace(',', '.'); // Convert to number, use 0 if missing
                }
                return processedRow;
            });
            setAccessData(processedData);
        });

        // svg.append('defs')
        //     .append("pattern")
        //     .attr("id", "diagonalHatch")
        //     .attr("width", 2)
        //     .attr("height", 2)
        //     .attr("patternUnits", "userSpaceOnUse")
        //     .attr("patternTransform", "rotate(45)")
        //     .append("rect")
        //     .attr("width", 2)
        //     .attr("height", 2)
        //     .attr("transform", "rotate(45)")
        //     .attr("fill", "white");

        setLoading(false);
    }, []);

    // Initialize the map only once
    useEffect(() => {
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = d3.select(ref.current)
            .append('svg')
            .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr('height', dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        const projection = d3.geoMercator()
            .center([20, 52])
            .scale(500)
            .translate([dimensions.width / 2, dimensions.height / 2]);
        const path = d3.geoPath().projection(projection);

        svg.selectAll('path')
            .data(europemap.features)
            .enter().append('path')
            .attr('d', path)
            .attr('stroke', 'white')
            .attr('fill', '#ccc')
            .attr('class', 'country')
            .style('cursor', 'help');

        svg.append('defs')
            .append("pattern")
            .attr("id", "diagonalHatch")
            .attr("width", 4)
            .attr("height", 4)
            .attr("patternUnits", "userSpaceOnUse")
            .attr("patternTransform", "rotate(45)")
            .append("rect")
            .attr("width", 1)
            .attr("height", 4)
            .attr("transform", "translate(0,0)")
            .attr("fill", "#ccc");

    }, [dimensions]);

    useEffect(() => {
        if (accessData.length === 0) return;

        const yearAccessData = accessData.map(d => d[selectedYear]);

        const accessByCountry = new Map(accessData.map(d => [d.country, d[selectedYear]]));

        d3.select(ref.current).selectAll('.country')
            // .on('mouseover', function (event, d) {
            //     // show tooltip
            //     const access = accessByCountry.get(d.properties.ISO2);
            //     const tooltip = d3.select('#tooltip');
            //     tooltip.style('display', 'block');
            //     tooltip.transition()
            //         .duration(200)
            //         .style('opacity', .9);
            //     tooltip.html(`<p style='color: #1e81b0'>${d.properties.NAME}</p>
            //                 <p style='color: #1e81b0'>${access ? access.toString() + '%' : 'No data'}</p>`)
            //         .style('left', (event.pageX) + 'px')
            //         .style('top', (event.pageY - 28) + 'px');
            // })
            // .on('mouseout', function (event, d) {
            //     // hide if the mouse leaves the country and it's not on the tooltip
            //     const tooltip = d3.select('#tooltip');
            //     if (!tooltip.node().contains(event.relatedTarget)) {
            //         tooltip.transition()
            //             .duration(500)
            //             .style('opacity', 0)
            //             .on('end', () => tooltip.style('display', 'none'));
            //     }

            // })
            .on('mouseover', function (event, d) {
                const access = accessByCountry.get(d.properties.ISO2);
                setTooltipContent(`<p>${d.properties.NAME}</p>
                                   <p><b>${access ? access.toString() + '%' : 'No data'}</b></p>`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
                setTooltipVisible(true);
                // reduce opacity of all countries except the one being hovered
                d3.selectAll('.country')
                    .transition()
                    .duration(200)
                    .style('opacity', 0.5);

                // highlight the hovered country
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1);
            })
            .on('mouseout', function (event, d) {
                setTooltipVisible(false);
                // reset opacity of all countries
                d3.selectAll('.country')
                    .transition()
                    .duration(200)
                    .style('opacity', 1);
            })

            // update fill color with a transition to the new color
            .transition()
            .duration(500)
            .attr('fill', d => {
                const access = accessByCountry.get(d.properties.ISO2);
                return access ? getColor(access) : 'url(#diagonalHatch)';
            })

    }, [selectedYear, accessData, dimensions]);

    return (
        <div className='w-screen plotsection'>
            <h1 className='plottitle'>The Digital Divide in European Households</h1>
            <p className='plotintro'>The first tap of the trip start from this map showing the percentage of households with internet access across European countries in different years.</p>
            <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                <div className='w-full flex justify-center items-center'>
                    <YearSelector yearList={[...Array(22).keys()].map(i => 2002 + i)} currentYear={selectedYear} setCurrentYear={setSelectedYear} />
                </div>
                <div className="mt-4" id="firstplot">
                    <h2 className="text-xl font-semibold">
                        Percentage of population have internet access in European households in {selectedYear}
                    </h2>
                </div>
            </div>
            {loading && (<Loader />)}
            <div className='flex justify-center items-center w-full h-full'>
                <div ref={ref} style={{ width: '100%', height: '100%', display: loading ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center' }}></div>
            </div>
            <ColorLegend
                orientation="horizontal"
                startLabel="0%"
                endLabel="100%"
            />
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
            <p className='plotexpl'>This map clearly shows the rapid growth of Internet use in Europe without much difference between countries differing in population or economy.</p>
            <div className='w-full flex flex-col items-center justify-center'>
                <div className={`${showDataPreparation ? 'h-[150px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                    <p id='explain-1' className='w-[80%] text-left mx-auto'>
                        The data displayed in this map were made available by Eurostat, specifically through this
                        <a href="https://doi.org/10.2908/ISOC_CI_IN_H" className='underline underline-offset-4 cursor-pointer' > dataset</a>.<br />
                        Essentially, uncollected data were changed from the representation <code>:</code> to the canonical <code>NaN</code>.<br /> In addition, string values such as <code>(b)</code> or <code>(u)</code> were removed to equalize the type of each dataset element to <code>float</code>.
                    </p>
                </div>
                <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
            </div>
        </div>
    );
}

export default Section1;
