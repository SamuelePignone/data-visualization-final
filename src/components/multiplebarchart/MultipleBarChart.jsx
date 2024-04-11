import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/cleaned_multibar_chart.json';
import { getColor } from '../Config';
import NationSelector from '../NationSelector';
import Loader from '../Loader';

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
        width: 300,
        height: 470,
        margin: { top: 50, right: 30, bottom: 0, left: 30 },
    });
    const [showDataPreparation, setShowDataPreparation] = useState(false);
    const [selectedGeo, setSelectedGeo] = useState("DE");
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const filteredData = dataFile.filter(d => d.geo === selectedGeo);
        const year_list = [...new Set(dataFile.map(d => d.TIME_PERIOD))].sort().slice(-4);
        const max_value = 100;

        //find the maximum value over all the years 
        const maxYearsValue = Math.max(...dataFile.map(d => d.OBS_VALUE));
        //console.log(maxCategoryValue);

        const normalizeValue = value => (value / maxYearsValue) * max_value;

        // create an svg with just the y tick labels
        const svg = container
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dimensions.width + dimensions.margin.left + dimensions.margin.right} ${dimensions.height + dimensions.margin.top + dimensions.margin.bottom}`) // This makes the chart responsive
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${dimensions.width + dimensions.margin.left + dimensions.margin.right - 2},${dimensions.margin.top})`);

        const indic_is_list = [...new Set(dataFile.map(d => d.indic_is))].map(indicIs => getCodeDefinition(indicIs));

        const yScale = d3.scaleBand()
            .domain(indic_is_list)
            .range([0, dimensions.height - dimensions.margin.top - dimensions.margin.bottom])
            .padding(0.1);

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-weight", "500")
            .style("font-size", "19px");

        year_list.forEach((year, index) => {
            const svg = container
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${dimensions.width + dimensions.margin.left + dimensions.margin.right} ${dimensions.height + dimensions.margin.top + dimensions.margin.bottom}`) // This makes the chart responsive
                .attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", `translate(${(index === 0) ? 0 : dimensions.margin.left},${dimensions.margin.top})`);

            let yearData = filteredData.filter(d => d.TIME_PERIOD === year);

            const categoryData = [...new Set(dataFile.map(d => d.indic_is))].map(indicIs => {
                const record = yearData.find(d => d.indic_is === indicIs);
                const value = record ? record.OBS_VALUE : 0;
                return { indic_is: getCodeDefinition(indicIs), value: value };
            });

            const xScale = d3.scaleLinear()
                .domain([0, max_value])
                .range([0, dimensions.width]);

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
                    return getColor(d.value, 0, max_value);
                })
                .transition() // adding a transition
                .duration(800)
                .attr("width", d => xScale(normalizeValue(d.value))) // transition to the actual width
                .attr("fill-opacity", 1); // slightly transparent for a more pleasant effect

            svg.selectAll(".bar-text")
                .data(categoryData)
                .enter()
                .append("text")
                .attr("class", "bar-text")
                .style("font-weight", "700")
                .text(d => d.value === 0 ? "No data" : `${d.value}%`)  // Conditionally set the text based on the value
                .attr("x", d => {
                    if (d.value === 0) {
                        return xScale(0) + 5; // Position "No data" labels slightly right of the y-axis
                    } else if (d.value < 15) {
                        return xScale(normalizeValue(d.value)) + 5;
                    } else {
                        return xScale(normalizeValue(d.value)) - 60;
                    }
                })
                .attr("y", d => yScale(d.indic_is) + yScale.bandwidth() / 2 + 4) // Center vertically in bar
                .attr("fill", d => d.value === 0 ? "#333" : "#333")
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
                .style("text-anchor", "end");

            if (index != 0) {
                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(yScale).tickFormat(""))
            }

            // if (index === 0) {
            //     svg.append("g")
            //         .attr("class", "y-axis")
            //         .call(d3.axisLeft(yScale))
            //         .selectAll("text")
            //         .style("text-anchor", "end") // Anchor text at the end to align after rotation
            // } else {
            //     svg.append("g")
            //         .attr("class", "y-axis")
            //         .call(d3.axisLeft(yScale).tickFormat(""));
            // }


            // Category label
            svg.append("text")
                .attr("x", 140)
                .attr("y", -20)
                .style("text-anchor", "middle")
                .style("font-size", "25px")
                .style("font-weight", "600")
                .attr("fill", d => getColor(year_list))
                .text(year_list[index]);
        })
        setLoading(false);
    }, [selectedGeo]);

    return (
    <>
        <div className='w-screen mt-24'>
            <h1 className='plottitle'>Individuals' Digital Skills Development</h1>
            <p className='plotintro'>With this small bar chart the different skills of people in different countries of Europe are shown.</p>
            {loading && <Loader />}
            <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                <div ref={ref} className='w-fit flex items-center justify-center -translate-x-[100px] mt-4'></div>
            </div>
            <p className='plotexpl'>The multiple small bar chart allows you to see how different IT skills have evolved over the past few years for each nation in Europe. </p>
            <div className='w-full flex flex-col items-center justify-center'>
                <div className={`${showDataPreparation ? 'h-[150px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                    <p id='explain-1' className='w-[80%] text-center mx-auto'>
                    The <a href="https://doi.org/10.2908/ISOC_SK_CSKL_I" className='underline underline-offset-4 cursor-pointer'>dataset</a> was taken from Eurostat. As in the previous chart, it has been modified so that it can be converted to .json. <br />
                     Each element has 4 values together representing digital skill <code>"indic_is"</code>, year <code>"TIME_PERIOD"</code>, country <code>"geo"</code> and observed value <code>"OBS_VALUE"</code>.
                    </p>
                </div>
                <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
            </div>
        </div>
    </>
    );
}

export default MultipleBarChart;