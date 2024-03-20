import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_yNHbo1Is82RqIZBFbkBBUA1rs4OXft0ghhucgXY8Kh7CfutB0Ed_nx-JL5i1i2tyZUegUWdTPTZ0/pub?gid=2024710507&single=true&output=csv";

function kde(X) {
    return 80;
}

function Section2() {
    const ref = useRef();
    const [densityTV, setDensityTV] = useState([]);
    const [densityMobile, setDensityMobile] = useState([]);
    const [densityPC, setDensityPC] = useState([]);
    const [data, setData] = useState([]);
    var margin = { top: 60, right: 30, bottom: 20, left: 110 },
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    useEffect(() => {
        // render the ridgeline plot
        var svg = d3.select(ref.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(dataUrl).then(data => {
            console.log(data);
            const categories = data.columns.slice(2);
            console.log(categories);
            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Create a Y scale for densities
            var y = d3.scaleLinear()
                .domain([0, 0.4])
                .range([height, 0]);

            var yName = d3.scaleBand()
                .domain(categories)
                .range([0, height])
                .paddingInner(1)
            svg.append("g")
                .call(d3.axisLeft(yName));

            const allDensity = [];

            categories.forEach(category => {
                const density = kde(data.map(d => d[category]));
                allDensity.push({ key: category, density: density });
                //setDensityTV(kde(data.filter(d => d['Indicator'] === "H_ITV").map(d => d.category)));
                //setDensityMobile(kde(data.filter(d => d['Indicator'] === "H_IMOBILE").map(d => d.category)));
                //setDensityPC(kde(data.filter(d => d['Indicator'] === "H_IPC").map(d => d.category)));
            });

            console.log(allDensity);

            var color = d3.scaleOrdinal()
                .domain(categories)
                .range(d3.schemeCategory10);

            svg.selectAll("areas")
                .data(allDensity)
                .enter()
                .append("path")
                .attr("transform", function (d) { return ("translate(0," + (yName(d.key)) + ")") })
                .datum(function (d) { return (d.density) })
                .attr("fill", function (d) { return (color(d.key)) })
                .attr("stroke", "#000")
                .attr("d", d3.line()
                    .curve(d3.curveBasis)
                    .x(function (d) { return x(d[0]); })
                    .y(function (d) { return y(d[1]); })
                );
        });
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <svg ref={ref}></svg>
        </div>
    );
}

export default Section2;
