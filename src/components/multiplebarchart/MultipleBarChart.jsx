import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/cleaned_multibar_chart.json';
import { getColor } from '../Config';

function MultipleBarChart() {
    const ref = useRef();
    const [dimensions, setDimensions] = useState({
        width: 200,
        height: 500,
        margin: { top: 5, right: 25, bottom: 30, left: 100 },
    });

    const [selectedGeo, setSelectedGeo] = useState("AL");

    useEffect(() => {

        console.log(dataFile);

        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const filteredData = dataFile.filter(d => d.geo === selectedGeo);
        console.log(filteredData);
        const year_list = [...new Set(dataFile.map(d => d.TIME_PERIOD))].sort().slice(-5);
        const max_value = 100;

        year_list.forEach((year, index) => {
            const svg = container
                .append('svg')
                .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
                .attr('height', dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
                .append('g')
                .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);
            
            const categoryData = [...new Set(dataFile.map(d => d.indic_is))].map(indicIs => {
                console.log(indicIs);
                const record = filteredData.find(d => d.indic_is === indicIs);
                console.log(record);
                const value = record ? record.OBS_VALUE : 0;
                return { indic_is: indicIs, value: value };
            });

            console.log(categoryData);

            const xScale = d3.scaleLinear()
                .domain([0, max_value])
                .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right]);

            const yScale = d3.scaleBand()
                .domain(categoryData.map(d => d.indic_is))
                .range([0, dimensions.height - dimensions.margin.top - dimensions.margin.bottom])
                .padding(0.1);


            svg.selectAll("xGrid")
                .data(xScale.ticks(12))
                .enter()
                .append("line")
                .attr("x1", function (d) { return xScale(d); })
                .attr("x2", function (d) { return xScale(d); })
                .attr("y1", 0)
                .attr("y2", dimensions.height - dimensions.margin.top - dimensions.margin.bottom)
                .attr("stroke", "lightgray")
                .attr("stroke-dasharray", 4);

            svg.selectAll(".category-bar")
                .data(categoryData)
                .enter()
                .append("rect")
                .attr("id", (d, i) => "bar-" + i)
                .attr("class", "category-bar")
                .attr("y", d => yScale(d.indic_is))
                .attr("width", 0)
                .attr("height", yScale.bandwidth())
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("fill", (d, i) => {
                    console.log(i);
                    return getColor(i, 0, 8);
                })
                .transition()
                .duration(800)
                .attr("width", d => xScale(d.value)) // transition to the actual width
                .attr("fill-opacity", 0.8);
        })
    }, []);

    return (
        <>
            <div className='flex justify-center items-center w-full h-full'>
                <div ref={ref} className='w-fit flex items-center'></div>
            </div>
        </>
    );
}

export default MultipleBarChart;