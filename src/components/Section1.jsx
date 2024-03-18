import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import europemap from '../map/europe.json';

function Section1() {
    const ref = useRef();
    const [dimensions, setDimensions] = useState({ // Defaults
        width: 960, 
        height: 600, 
    });
    const [accessData, setAccessData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("2023");

    // Effect hook to handle window resize
    useEffect(() => {
        const updateDimensions = () => {
            if (ref.current) {
                setDimensions({
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight,
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
        const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTosOMt-nisY0b03je3jyLy-RCAUVymrLNuHU7xDfX15WH24zYE-2k5XUVcpSsPUMALUvDDUrfiDfwJ/pub?gid=378454871&single=true&output=csv";

        d3.csv(dataUrl).then(data => {
            const processedData = data.map(row => {
                const processedRow = { country: row.country_codes };
                for (let year = 2002; year <= 2023; year++) {
                    processedRow[year.toString()] = +row[year.toString()] || 0; // Convert to number, use 0 if missing
                }
                return processedRow;
            });
            setAccessData(processedData);
        });
    }, []);

    // Initialize the map only once
    useEffect(() => {
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = d3.select(ref.current)
            .append('svg')
            .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

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
            .attr('class', 'country'); 
    }, [dimensions]);

    useEffect(() => {
        if (accessData.length === 0) return;

        const yearAccessData = accessData.map(d => d[selectedYear]);
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain(d3.extent(yearAccessData));

        const accessByCountry = new Map(accessData.map(d => [d.country, d[selectedYear]]));

        d3.select(ref.current).selectAll('.country')
            .attr('fill', d => {
                const access = accessByCountry.get(d.properties.ISO2);
                return access ? colorScale(access) : '#ccc';
            });
    }, [selectedYear, accessData]);

    const handleYearChange = (event) => setSelectedYear(event.target.value);

    return (
        <div className='h-screen w-screen'>
            <select value={selectedYear} onChange={handleYearChange}>
                {[...Array(22).keys()].map(i => {
                    const year = 2002 + i;
                    return <option key={year} value={year}>{year}</option>;
                })}
            </select>
            <div ref={ref} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
}

export default Section1;
