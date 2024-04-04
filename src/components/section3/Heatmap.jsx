import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/cleaned_heatmap.json';

function Section3D3() {
    const [selectedYear, setSelectedYear] = useState("2023");
    const svgRef = useRef();
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        setAvailableYears(Object.keys(dataFile));
        // Initialize or update the heatmap when component mounts or selectedYear changes
        drawHeatmap(dataFile[selectedYear]);
    }, [selectedYear]);

    // Function to draw the heatmap
    const drawHeatmap = (data) => {
        const svg = d3.select(svgRef.current);
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        // Clear previous contents
        svg.selectAll("*").remove();

        // Setup scales - assuming your data structure, adjust as needed
        const xScale = d3.scaleBand().range([0, width]).domain(data.map(d => d.x)).padding(0.05);
        const yScale = d3.scaleBand().range([height, 0]).domain(data.map(d => d.y)).padding(0.05);
        const colorScale = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateBlues);

        // Draw cells
        svg.selectAll()
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .style("fill", d => colorScale(d.value));
    };

    return (
        <>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <svg ref={svgRef} width={700} height={500}></svg>
        </>
    );
}

export default Section3D3;
