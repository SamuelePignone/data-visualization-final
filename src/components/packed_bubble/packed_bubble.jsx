import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/Packed_bubble_chart_data.json';
import { getColor } from '../Config';
import Loader from '../Loader';
import NationSelector from '../NationSelector';
import YearSelector from '../YearSelector';





function PackedBubble() {
    const [selectedYear, setSelectedYear] = useState(2023);
    const [availableYears, setAvailableYears] = useState([...new Set(dataFile.map(d => d.TIME_PERIOD))])
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [selectedGeo, setSelectedGeo] = useState("DE");
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);

    const max_value = Math.max(...dataFile.map(d => d.OBS_VALUE));

    const [dimensions, setDimensions] = useState({
        width: 900,
        height: 500,
        margin: { top: 5, right: 25, bottom: 20, left: 150 },
    });

    useEffect(() => {
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = container
            .append('svg')
            .attr('id', 'packed_bubble')
            .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr('height', dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        var size = d3.scaleLinear()
            .domain([0, max_value])
            .range([0, 50]);

        var Tooltip = container
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var node = svg.append("g")
            .selectAll("circle")
            .data(dataFile.filter(d => d.TIME_PERIOD === selectedYear && d.OBS_VALUE > 0 && d.geo === selectedGeo))
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function (d) { return size(d.OBS_VALUE) })
            .attr("cx", dimensions.width / 2)
            .attr("cy", dimensions.height / 2)
            .style("fill", function (d) { return getColor(d.OBS_VALUE, 0, 100) })//use the indicator value to determine the color
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(dimensions.width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d.OBS_VALUE) + 3) }).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(dataFile.filter(d => d.TIME_PERIOD === selectedYear && d.OBS_VALUE > 0 && d.geo === selectedGeo))
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
            });

        // What happens when a circle is dragged?
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

        setLoading(false);

    }, [selectedGeo]);

    return (
    <div className='w-screen mt-24 mb-64'>
        {loading && <Loader />}
        <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
            <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
            <div ref={ref} className='w-fit flex items-center justify-center mt-4'></div>
        </div>
    </div>
    );



}

export default PackedBubble;