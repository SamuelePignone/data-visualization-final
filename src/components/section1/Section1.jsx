import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from '../Tooltip';
import { getColor } from '../Config';
import ColorLegend from '../ColorLegend';
import AnimationControl from '../AnimationControl';
import { BarList } from 'reaviz';
import europemap from '../../map/europe_cleaned.json';
import { FaCirclePlay, FaCircleStop } from "react-icons/fa6";

function Section1() {
    const ref = useRef();
    const [dimensions, setDimensions] = useState({ // Defaults
        width: 960,
        height: 500,
        margin: { top: 50, right: 30, bottom: 30, left: 60 },
    });
    const [accessData, setAccessData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("2023");
    const [loading, setLoading] = useState(false);
    const [animation, setAnimation] = useState(false);

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Effect hook to handle window resize
    useEffect(() => {
        const updateDimensions = () => {
            if (ref.current) {
                setDimensions({
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight,
                    margin: { top: 50, right: 30, bottom: 30, left: 60 },
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        // Set initial dimensions
        updateDimensions();

        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

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
                                   <p>${access ? access.toString() + '%' : 'No data'}</p>`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
                setTooltipVisible(true);
            })
            .on('mouseout', function (event, d) {
                setTooltipVisible(false);
            })

            // update fill color with a transition to the new color
            .transition()
            .duration(500)
            .attr('fill', d => {
                const access = accessByCountry.get(d.properties.ISO2);
                return access ? getColor(access) : '#ccc';
            })
    }, [selectedYear, accessData, dimensions]);

    const handleYearChange = (event) => setSelectedYear(event.target.value);

    return (
        <div className='w-screen'>
            <select value={selectedYear} onChange={handleYearChange}>
                {[...Array(22).keys()].map(i => {
                    const year = 2002 + i;
                    return <option key={year} value={year}>{year}</option>;
                })}
            </select>
            {loading && <p>Loading...</p>}

            <div ref={ref} style={{ width: '100%', height: '100%', display: loading ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center' }}></div>
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
                    onYearChange={(currentYear) => setSelectedYear(currentYear)}
                    isActive={animation}
                    setIsActive={setAnimation}
                    text={'Start an animation from '+'2022'+' to '+'2023'}
                />
            </div>
        </div>
    );
}

export default Section1;
