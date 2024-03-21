import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_yNHbo1Is82RqIZBFbkBBUA1rs4OXft0ghhucgXY8Kh7CfutB0Ed_nx-JL5i1i2tyZUegUWdTPTZ0/pub?gid=2024710507&single=true&output=csv";

function kernelDensityEstimator(kernel, X) {
    // manage nan by replacing with 0
    X = X.map(function (x) {
        return isNaN(x) ? 0 : x;
    });
    return function (V) {
        return X.map(function (x) {
            return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
    };
}


function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
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
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        /*var color = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeCategory10);
        */

        // Create the x axis
        var x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        d3.csv(dataUrl).then(data => {
            const categories = data.columns.slice(2);
            const n = categories.length;
            var spacing = height / n;

            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            let allDensity = [];
            var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
            categories.forEach(category => {
                var density_TV = kde(data.filter(d => d['Indicator'] === "H_IMPH").map(d => d[category.toString()]));
                allDensity.push({ key: category, density: density_TV });
                //setDensityTV(kde(data.filter(d => d['Indicator'] === "H_ITV").map(d => d.category)));
                //setDensityMobile(kde(data.filter(d => d['Indicator'] === "H_IMOBILE").map(d => d.category)));
                //setDensityPC(kde(data.filter(d => d['Indicator'] === "H_IPC").map(d => d.category)));
            });
            var y = d3.scaleLinear()
                .domain([0, d3.max(allDensity, d => d3.max(d.density, d => d[1]))])
                .range([spacing, 0]);

            var yName = d3.scaleBand()
                .domain(categories)
                .range([0, height])
                .padding(1);

            svg.append("g")
                .call(d3.axisLeft(yName).tickSize(0))
                .select(".domain").remove();

            allDensity = allDensity.filter(entry => entry.key !== undefined);

            svg.selectAll("line.y-axis-line")
                .data(allDensity.map(d => d.key))
                .enter().append("line")
                .attr("class", "y-axis-line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => yName(d))
                .attr("y2", d => yName(d))
                .style("stroke", "black");

            console.log(allDensity[0]);

            svg.selectAll("areas")
                .data(allDensity)
                .enter()
                .append("path")
                    .attr("transform", d => {
                        const translateY = yName(d.key);

                        // Apply the transformation for valid numeric values
                        return "translate(0," + (translateY - spacing) + ")";
                    })
                    .datum(function (d) { return d.density; })
                    .attr("fill", "none")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1)
                    .attr("d", d3.line()
                        .curve(d3.curveBasis)
                        .x(function (d) { return x(d[0]); })
                        .y(function (d) { return y(d[1]); })
                    )
                    .attr("fill", "#69b3a2")
                    .attr("d", d3.area()
                        .curve(d3.curveBasis)
                        .x(function (d) { return x(d[0]); })
                        .y0(spacing)
                        .y1(function (d) { return y(d[1]); })
                    )
        });
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <svg ref={ref}></svg>
        </div>
    );
}

export default Section2;
