import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/cleaned_heatmap.json';

function Section3D3Heatmap() {
    const svgRef = useRef(null);
    const [selectedYear, setSelectedYear] = useState("2023");
    const [availableYears, setAvailableYears] = useState([]);
    const [animation, setAnimation] = useState(false);
    const intervalRef = useRef(null);

    // Initialization and Drawing Logic
    useEffect(() => {
        if (!dataFile[selectedYear]) return;

        const data = dataFile[selectedYear];
        const margin = { top: 50, right: 30, bottom: 30, left: 60 };
        const width = 1300 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Clean up SVG
        d3.select(svgRef.current).selectAll("*").remove();

        // Set up SVG container
        const svg = d3.select(svgRef.current)
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scale setup
        const xScale = d3.scaleBand()
                         .range([0, width])
                         .domain(data.map(d => d.x))
                         .padding(0.01);

        const yScale = d3.scaleBand()
                         .range([height, 0])
                         .domain(data.map(d => d.y))
                         .padding(0.01);

        const colorScale = d3.scaleSequential()
                             .interpolator(d3.interpolateInferno)
                             .domain([0, d3.max(data, d => d.value)]);

        // Drawing the heatmap
        svg.selectAll()
           .data(data, d => d.x + ':' + d.y)
           .join("rect")
           .attr("x", d => xScale(d.x))
           .attr("y", d => yScale(d.y))
           .attr("width", xScale.bandwidth())
           .attr("height", yScale.bandwidth())
           .style("fill", d => colorScale(d.value));

        // Adding Axes
        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(xScale));

        svg.append("g")
           .call(d3.axisLeft(yScale));

    }, [selectedYear]);

    // Available Years Logic
    useEffect(() => {
        setAvailableYears(Object.keys(dataFile));
    }, []);

    // Animation Logic
    useEffect(() => {
        if (animation) {
            let index = availableYears.indexOf(selectedYear);
            intervalRef.current = setInterval(() => {
                index = (index + 1) % availableYears.length;
                setSelectedYear(availableYears[index]);
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [animation, availableYears, selectedYear]);

    const play = () => {
        setAnimation(true);
    };

    const stop = () => {
        setAnimation(false);
        clearInterval(intervalRef.current);
    };

    return (
        <>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <svg ref={svgRef}></svg>
            {animation ? (
                <button onClick={stop}>Stop</button>
            ) : (
                <button onClick={play}>Play</button>
            )}
        </>
    );
}

export default Section3D3Heatmap;
