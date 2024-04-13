import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataFile from '../../data/Area_chart.json';
import { getColor } from '../Config';



const processData = (data) => {
    const grouped = d3.group(data, d => d.TIME_PERIOD); // Group data by TIME_PERIOD
    const processedData = [];

    grouped.forEach((values, key) => {
        const entry = { TIME_PERIOD: key };
        values.forEach(d => {
            entry[d.size_emp] = (entry[d.size_emp] || 0) + d.OBS_VALUE; // Sum OBS_VALUE for each size_emp
        });
        processedData.push(entry);
    });

    return processedData.sort((a, b) => d3.ascending(a.TIME_PERIOD, b.TIME_PERIOD)); // Sort by TIME_PERIOD if needed
};

function StackedAreaChart() {
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 1000,
        margin: { top: 0, right: 25, bottom: 20, left: 100 },
    });

    const [size_ent, setEntList] = useState([...new Set(dataFile.map(d => d.size_emp))]);

    useEffect(() => {
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = container
            .append('svg')
            .attr('id', 'stacked_area_chart')
            .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr('height', dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        const x_domain = d3.extent(dataFile, d => d.TIME_PERIOD);
        const y_domain = [0, d3.max(dataFile, d => d.OBS_VALUE)];

        const x = d3.scaleLinear()
            .domain(x_domain)
            .range([0, dimensions.width - dimensions.margin.right - dimensions.margin.left]);

        const y = d3.scaleLinear()
            .domain(y_domain)
            .range([dimensions.height - dimensions.margin.top - dimensions.margin.bottom, 0])
            .nice();

        const xAxis = d3.axisBottom(x)
            .ticks(x_domain[1] - x_domain[0])
            .tickFormat(d3.format("d"));

        const yAxis = d3.axisLeft(y)
            .ticks(10)

        svg.append("g")
            .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.top - dimensions.margin.bottom})`)
            .call(xAxis)
            .selectAll('text')
            .style('font-size', '14px')
            .style("font-weight", "700")
            .attr('transform', 'rotate(-45)')
            .attr('x', -10)
            .attr('y', 5)
            .style('text-anchor', 'end');

        svg.append("g")
            .call(yAxis)
            .selectAll('text')
            // add % sign to y-axis labels
            .text(d => d + '%')
            .style('font-size', '12px')
            .style("font-weight", "700");

        const processedData = processData(dataFile);
    
        const area = d3.area()
        .x(d => x(d.TIME_PERIOD))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));

        const stack = d3.stack()
        .keys(size_ent)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

        const series = stack(processedData);

        
        svg.selectAll(".layer")
            .data(series)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", area)
            .attr("fill", d => getColor(d.key));

    }, []);
    return (
        <div className="w-screen mb-64">
            <h1>Stacked Area Chart</h1>
            <div ref={ref}></div>
        </div>
    );
}
export default StackedAreaChart;