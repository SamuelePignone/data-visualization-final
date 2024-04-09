import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/cleaned_multibar_chart.json';
import { getColor } from '../Config';

function getCodeDefinition(code) {
  const codeMap = {
    I_CCONF: "Settings Modification",
    I_CCPY: "File Handling",
    I_CEPVA: "Software Configuration",
    I_CISK_SFJOB: "Job Skills Confidence",
    I_CISK_SFVIRNA: "Security Confidence (NA)",
    I_CPRES1: "Presentations Creation",
    I_CPRG1: "Programming",
    I_CXLS: "Spreadsheet Use",
    I_CXLSADV: "Advanced Spreadsheets"
  };

  return codeMap[code] || "Unknown Code";
}

function MultipleBarChart() {
    const ref = useRef();
    const [dimensions, setDimensions] = useState({
        width: 420,
        height: 470,
        margin: { top: 50, right: 0, bottom: 0, left: 120 },
    });

    const [selectedGeo, setSelectedGeo] = useState("DE");

    useEffect(() => {

        //console.log(dataFile);
        //console.log(dataFile.filter(d => d.indic_is === "I_CCPY"));
        console.log("CIAOOOO")
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const filteredData = dataFile.filter(d => d.geo === selectedGeo);
        const year_list = [...new Set(dataFile.map(d => d.TIME_PERIOD))].sort().slice(-4);
        const max_value = 100;

        console.log(year_list.length);
        //find the maximum value over all the years 
        const maxYearsValue = Math.max(...dataFile.map(d => d.OBS_VALUE)); 
        //console.log(maxCategoryValue);

        const normalizeValue = value => (value / maxYearsValue) * max_value;

        year_list.forEach((year, index) => {
            console.log(year);

            d3.select(ref.current)
            .append('div')
            .style("display", "inline-block")  
            .style("margin-right", index < year_list.length - 1 ? "5px" : "0px"); // Add margin to the right of each div except the last one

            const svg = container
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${dimensions.width + dimensions.margin.left + dimensions.margin.right} ${dimensions.height + dimensions.margin.top + dimensions.margin.bottom}`) // This makes the chart responsive
                .attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);
            
            const categoryData = [...new Set(dataFile.map(d => d.indic_is))].map(indicIs => {
                const record = filteredData.find(d => d.indic_is === indicIs);
                const value = record ? record.OBS_VALUE : 0;
                return { indic_is: getCodeDefinition(indicIs), value: value };
            });
            //console.log(categoryData);


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
                    //console.log(i);
                    return getColor(i, 0, 8);
                })
                .transition() // adding a transition
                .duration(800)
                .attr("width", d => xScale(normalizeValue(d.value))) // transition to the actual width
                .attr("fill-opacity", 0.8); // slightly transparent for a more pleasant effect

                    svg.selectAll(".bar-text")
                    .data(categoryData)
                    .enter()
                    .append("text")
                    .attr("class", "bar-text")
                    .text(d => d.value === 0 ? "No data" : `${d.value}%`)  // Conditionally set the text based on the value
                    .attr("x", d => {
                        if (d.value === 0) {
                            return xScale(0) + 5; // Position "No data" labels slightly right of the y-axis
                        } else if (d.value < 15) {
                            return xScale(normalizeValue(d.value)) + 5;
                        } else {
                            return xScale(normalizeValue(d.value)) - 48; // Adjust as needed for your chart's aesthetics
                        }
                    })
                    .attr("y", d => yScale(d.indic_is) + yScale.bandwidth() / 2 + 4) // Center vertically in bar
                    .attr("fill", d => d.value === 0 ? "#333" : "#333") 
                    .style("font", "12px Montserrat")
                    .style("visibility", "hidden") 
                    .transition() 
                    .duration(800)
                    .style("visibility", "visible"); 

                            // X-axis
                    svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${dimensions.height - dimensions.margin.top - dimensions.margin.bottom})`)
                    // .call(d3.axisBottom(xScale))
                    .selectAll("text")
                    // .attr("transform", "translate(-5, 10)rotate(-45)")
                    .style("font", "15px Montserrat")
                    .style("text-anchor", "end");

                    if (index === 0) {
                        svg.append("g")
                        .attr("class", "y-axis")
                        .call(d3.axisLeft(yScale))
                        .selectAll("text")
                        .style("text-anchor", "end") // Anchor text at the end to align after rotation
                    } else {
                        svg.append("g")
                            .attr("class", "y-axis")
                            .call(d3.axisLeft(yScale).tickFormat(""));
                    }


                    // Category label
                    svg.append("text")
                    .attr("x", 140)
                    .attr("y", -20) 
                    .style("text-anchor", "middle")
                    .style("font", "25px Montserrat")
                    .style("weight", "900")
                    .attr("fill", d => getColor(year_list))
                    .text(year_list[index]);
        })
    }, [selectedGeo]);

    return (
        <>
            <div className='flex justify-center items-center w-full h-full'>
                <div ref={ref} className='w-fit flex items-center'></div>
            </div>
        </>
    );
}

export default MultipleBarChart;