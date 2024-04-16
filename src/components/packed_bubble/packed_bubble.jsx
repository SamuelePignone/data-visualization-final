import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/Packed_bubble_chart_data.json';
import { getColor } from '../Config';
import Loader from '../Loader';
import NationSelector from '../NationSelector';
import { mapstate, map_size_emp, map_size_emp_to_number, map_dii_to_description } from '../MapState';
import Tooltip from '../Tooltip';



function PackedBubble() {
    const [selectedYear, setSelectedYear] = useState(2023);
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [selectedGeo, setSelectedGeo] = useState("DE");
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);

    const max_value = Math.max(...dataFile.map(d => d.OBS_VALUE));

    const [showDataPreparation, setShowDataPreparation] = useState(false);

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 1000,
        margin: { top: 0, right: 25, bottom: 20, left: 100 },
    });

    useEffect(() => {
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        //print out the different valuesof indic_is column in the dataset
        console.log([...new Set(dataFile.map(d => d.indic_is))]);

        const svg = container
            .append('svg')
            .attr('id', 'packed_bubble')
            .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr('height', dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        var size = d3.scaleLinear()
            .domain([0, max_value])
            .range([0, 100]);

        var node = svg.append("g")
            .selectAll("circle")
            .data(dataFile.filter(d => d.TIME_PERIOD === selectedYear && d.OBS_VALUE > 0 && d.geo === selectedGeo))
            .enter()
            .append("circle")
            .attr("cursor", "pointer")
            .attr("class", "node")
            .attr("r", function (d) { return size(d.OBS_VALUE) * 2 })
            .attr("cx", dimensions.width / 2)
            .attr("cy", dimensions.height / 2)
            .style("fill", function (d) { return getColor(map_size_emp_to_number(d.size_emp), 0, 100) })//use the indicator value to determine the color
            .style("fill-opacity", 1)
            .attr("stroke", "white")
            .style("stroke-width", 0.8)
            .style("filter", "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.3))") // Add shadow with opacity of 0.3
            .on("mouseover", (event, d) => {
                setTooltipContent(`Country: ${mapstate(d.geo)} <br> Percentage: ${d.OBS_VALUE} <br> Year: ${d.TIME_PERIOD} <br> Enterprise size: ${map_size_emp(d.size_emp)} <br> Digital intensity index: ${map_dii_to_description(d.indic_is)}`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
                setTooltipVisible(true);
            }).on("mouseout", () => {
                setTooltipVisible(false);
            })
            .on("mousemove", (event, d) => {
                setTooltipContent(`Country: ${mapstate(d.geo)} <br> Value: ${d.OBS_VALUE} digital intensity <br> Year: ${d.TIME_PERIOD} <br> Enterprise size: ${map_size_emp(d.size_emp)} <br> Digital intensity index: ${map_dii_to_description(d.indic_is)}`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
            })
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        svg.append("g")
            .selectAll("circle")
            .data(dataFile.filter(d => d.TIME_PERIOD === selectedYear && d.OBS_VALUE > 0 && d.geo === selectedGeo))
            .enter()
            .append("text")
            .attr("class", "textnode")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .each(function (d) {
                if (size(d.OBS_VALUE) > 40) {
                    var text = d3.select(this);
                    text.append("tspan")
                        .attr("class", "tspan1")
                        .attr("x", text.attr("x"))
                        .attr("dy", "1.2em")
                        .attr("text-anchor", "middle")
                        .attr("font-weight", "bold")
                        .attr("font-size", "19px")
                        .text(d => d.size_emp);

                    text.append("tspan")
                        .attr("class", "tspan2")
                        .attr("x", text.attr("x"))
                        .attr("dy", "1.2em")
                        .attr("text-anchor", "middle")
                        .text(d => map_dii_to_description(d.indic_is));
                }
            })
            .on("mouseover", (event, d) => {
                setTooltipContent(`Country: ${mapstate(d.geo)} <br> Value: ${d.OBS_VALUE} <br> Year: ${d.TIME_PERIOD} <br> Enterprise size: ${map_size_emp(d.size_emp)} <br> Digital intensity index: ${map_dii_to_description(d.indic_is)}`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
                setTooltipVisible(true);
            }).on("mouseout", () => {
                setTooltipVisible(false);
            })
            .on("mousemove", (event, d) => {
                setTooltipContent(`Country: ${mapstate(d.geo)} <br> Value: ${d.OBS_VALUE} digital intensity <br> Year: ${d.TIME_PERIOD} <br> Enterprise size: ${map_size_emp(d.size_emp)} <br> Digital intensity index: ${map_dii_to_description(d.indic_is)}`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
            })
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(dimensions.width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.1).radius(function (d) { return (size(d.OBS_VALUE * 2) + 3) }).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(dataFile.filter(d => d.TIME_PERIOD === selectedYear && d.OBS_VALUE > 0 && d.geo === selectedGeo))
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y - 100; });

                svg.selectAll(".textnode")
                    .attr("x", function (d) { return d.x; })
                    .attr("y", function (d) { return d.y - 115; })
                    .each(function (d) {
                        if (size(d.OBS_VALUE) > 40) {
                            var text = d3.select(this);
                            text.select(".tspan1")
                                .attr("x", text.attr("x"))
                                .attr("dy", "1.2em")
                                .attr("text-anchor", "middle")
                                .text(d => d.size_emp);

                            text.select(".tspan2")
                                .attr("x", text.attr("x"))
                                .attr("dy", "1.2em")
                                .attr("text-anchor", "middle")
                                .text(d => map_dii_to_description(d.indic_is));
                        }
                    });
            });

        // What happens when a circle is dragged?
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

        setLoading(false);

        return () => {
            simulation.stop();
        };

    }, [selectedGeo, selectedGeo]);

    return (
        <div className='w-screen mb-64 plotsection'>
            <h1 className='plottitle'>Digitalization in enterprises</h1>
            <p className='plotintro'>Below, we can see the percentage of companies with the same digital intensity index for different companies according to their size, for each European country.</p>
            {loading && <Loader />}
            <div className='flex-col justify-center items-center w-full h-full mb-10' style={{ display: loading ? 'none' : 'flex' }}>
                <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                <div ref={ref} className='w-fit flex items-center justify-center'></div>
            </div>
            <Tooltip
                content={<div dangerouslySetInnerHTML={{ __html: tooltipContent }} />}
                isVisible={tooltipVisible}
                style={{
                    left: tooltipPosition.x,
                    top: tooltipPosition.y,
                }}
            />
            <p className='plotexpl'>The radius of each bubble is represented by the percentage of enterprises in a certain European nation with a certain digital intensity index (DII). <br />The colors represent the size of the companies. <br /> Looking at the graph, it can be seen that the size of companies does not determine their capacity in the digital sphere.  </p>
            <div className='w-full flex flex-col items-center justify-center'>
                <div className={`${showDataPreparation ? 'h-[100px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                    <p id='explain-1' className='w-[80%] text-center mx-auto'>
                        In this graph we have shown of data from this eurostat <a href="https://doi.org/10.2908/ISOC_E_DII" className='underline underline-offset-4 cursor-pointer' >dataset</a> . To prepare them for display, we removed unnecessary columns and transformed the format from csv to json. We selected 4 different digital intensity indexes <code>['E_DI3_HI', 'E_DI3_LO', 'E_DI3_VHI', 'E_DI3_VLO']</code> and 4 different sizes for companies.
                    </p>
                </div>
                <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
            </div>
        </div>
    );



}

export default PackedBubble;