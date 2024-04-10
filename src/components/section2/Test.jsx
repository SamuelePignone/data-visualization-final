import React, { useEffect, useRef, useState } from 'react';
import { colorScheme } from '../Config';
import * as d3 from 'd3';
import Loader from '../Loader';

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_yNHbo1Is82RqIZBFbkBBUA1rs4OXft0ghhucgXY8Kh7CfutB0Ed_nx-JL5i1i2tyZUegUWdTPTZ0/pub?gid=2024710507&single=true&output=csv";

// Function to compute kernel density estimation while handling missing data
function kernelDensityEstimatorWithMissing(kernel, X) {
    return function (V) {
        return X.map(function (x) {
            var validValues = V.filter(function (v) {
                return v !== ":" && !isNaN(v); // Check for missing values and NaNs
            });
            return [x, d3.mean(validValues, function (v) { return kernel(x - v); })];
        });
    };
}

// Function to compute kernel Epanechnikov kernel
function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

function Test() {
    const ref = useRef();
    const [dimensions, setDimensions] = useState({
        width: 800,
        height: 400,
        margin: { top: 50, right: 30, bottom: 30, left: 60 },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // clean the container
        d3.select(ref.current).selectAll('svg').remove();

        // set the dimensions and margins of the graph
        const { width, height, margin } = dimensions;

        // append the svg object to the body of the page
        var svg = d3.select(ref.current)
            .append("svg")
            .attr("width", "60%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`) // This makes the chart responsive
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //read data
        d3.csv(dataUrl).then(function (data) {
            var categories = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2014"];
            var indicators = ["H_ITV", "H_IMPH", "H_IPC"];
            var n = categories.length

            // convert the data from , to .
            var new_data = data.map(function (d) {
                var newD = { ...d }; // create a copy of d to avoid mutating the original object
                for (var i in categories) {
                    if (newD[categories[i]] == "nan") {
                        newD[categories[i]] = ":";
                    } else {
                        newD[categories[i]] = newD[categories[i]].replace(",", ".");
                    }
                }
                return newD;
            });

            // Compute the mean of each group
            var tvMeans = [];
            var mobileMeans = [];
            var pcMeans = [];
            var currentGroup;

            var yMax = 0;

            indicators.forEach(function (indicator) {
                var mean = 0;
                for (var i in categories) {
                    currentGroup = categories[i];
                    var max = d3.max(new_data.filter(d => d['Indicator'] === indicator).map(d => +d[currentGroup]));
                    if (max > yMax) yMax = max;
                    mean = d3.mean(new_data.filter(d => d['Indicator'] === indicator).map(d => +d[currentGroup]));
                    if (indicator === "H_ITV") tvMeans.push(mean);
                    if (indicator === "H_IMPH") mobileMeans.push(mean);
                    if (indicator === "H_IPC") pcMeans.push(mean);
                }
            });

            // Tooltip
            var tooltip = d3.select("#tooltip");

            // Add X axis
            var x = d3.scaleLinear()
                .domain([-10, 120])
                .range([0, width]);

            var spacing = height / n;

            svg.append("g")
                .attr("class", "xAxis")
                .style("font-size", "12px")
                .attr("transform", "translate(0," + (height) + ")")
                .call(d3.axisBottom(x).tickValues([0, 25, 50, 75, 100]).tickSize(-height))
                .select(".domain").remove()

            svg.selectAll(".xAxis .tick text")
                .attr("y", 10);

            // Add X axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height + 40)
                .style("font-size", "15px")
                .style("fill", "#fff")
                .text("Probability (%)");

            // Create a Y scale for densities
            var y = d3.scaleLinear()
                .domain([0, yMax/1000])
                .range([spacing, 0]);

            // Create the Y axis for names
            var yName = d3.scaleBand()
                .domain(categories)
                .range([1, height])
                .paddingInner(1)

            svg.append("g")
                .call(d3.axisLeft(yName).tickSize(0))
                .style("font-size", "12px")
                .select(".domain").remove()


            // Compute kernel density estimation for each column:
            var kde = kernelDensityEstimatorWithMissing(kernelEpanechnikov(7), x.ticks(40));
            var tvDensity = []
            var mobileDensity = []
            var pcDensity = []
            var key
            var density
            var i
            indicators.forEach(function (indicator) {
                for (i = 0; i < n; i++) {
                    key = categories[i]
                    density = kde(new_data.filter(d => d['Indicator'] === indicator).map(d => d[key]));
                    if (indicator === "H_ITV") tvDensity.push({ key: key, density: density })
                    if (indicator === "H_IMPH") mobileDensity.push({ key: key, density: density })
                    if (indicator === "H_IPC") pcDensity.push({ key: key, density: density })
                }
            })

            var tvYearMeanData = []; // This will hold the new data structure
            var mobileYearMeanData = []; // This will hold the new data structure
            var pcYearMeanData = []; // This will hold the new data structure

            indicators.forEach(function (indicator) {
                for (var i = 0; i < categories.length; i++) {
                    var year = categories[i]; // Get the year from the categories array
                    var meanValue = indicator === "H_ITV" ? tvMeans[i] : indicator === "H_IMPH" ? mobileMeans[i] : pcMeans[i]; // Get the mean value from the means array

                    // Construct an object with year and meanValue
                    var yearMeanObject = {
                        year: year,
                        mean: meanValue
                    };
                    if (indicator === "H_ITV") tvYearMeanData.push(yearMeanObject);
                    if (indicator === "H_IMPH") mobileYearMeanData.push(yearMeanObject);
                    if (indicator === "H_IPC") pcYearMeanData.push(yearMeanObject);
                }
            });

            indicators.forEach(function (indicator) {

                // Create a color scale using the custom interpolator
                var myColor = function (t) {
                    if (indicator === "H_ITV") {
                        //return d3.interpolateBlues(t);
                        return colorScheme[0];
                    }
                    if (indicator === "H_IPC") {
                        //return d3.interpolateGreens(t);
                        // return color in the middle of the color scheme
                        return colorScheme[Math.floor(colorScheme.length / 2)];
                    }
                    if (indicator === "H_IMPH") {
                        //return d3.interpolateOranges(t);
                        // return last color of the color scheme
                        return colorScheme[colorScheme.length - 1];
                    }
                };

                // Add areas
                svg.selectAll("areas")
                    .data(indicator === "H_ITV" ? tvDensity : indicator === "H_IMPH" ? mobileDensity : pcDensity)
                    .enter()
                    .append("path")
                    .attr("class", "area")
                    .attr("transform", function (d) { return "translate(0," + (yName(d.key) - spacing) + ")" })
                    .attr("fill", function (d) {
                        var value;
                        if (indicator === "H_ITV") {
                            value = tvYearMeanData.find(function (yearData) { return yearData.year === d.key; }).mean;
                        }
                        if (indicator === "H_IMPH") {
                            value = mobileYearMeanData.find(function (yearData) { return yearData.year === d.key; }).mean;
                        }
                        if (indicator === "H_IPC") {
                            value = pcYearMeanData.find(function (yearData) { return yearData.year === d.key; }).mean;
                        }
                        return myColor(value / 100);
                    })
                    .datum(function (d) { return d.density; })
                    .attr("opacity", 1)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1)
                    .attr("d", d3.line()
                        .curve(d3.curveBasis)
                        .x(function (d) { return x(d[0]); })
                        .y(function (d) { return y(d[1]); })
                    )
                    .data(indicator === "H_ITV" ? tvDensity : indicator === "H_IMPH" ? mobileDensity : pcDensity)
                    .on("mouseover", function (event, d) {
                        var yearData = indicator === "H_ITV" ? tvYearMeanData.find(function (yearData) { return yearData.year === d.key; }) : indicator === "H_IMPH" ? mobileYearMeanData.find(function (yearData) { return yearData.year === d.key; }) : pcYearMeanData.find(function (yearData) { return yearData.year === d.key; });
                        var year = yearData.year;
                        var meanValue = yearData.mean;

                        d3.select(this)
                            .raise() // This brings the hovered area to the front
                            .transition()
                            .duration(100)
                            .attr("opacity", 0.8)
                            .attr("stroke-width", 2);

                        // Reduce opacity of other areas
                        d3.selectAll('.area')
                            .transition()
                            .duration(100)
                            .attr("opacity", function (otherD) {
                                return otherD === d ? 0.8 : 0.3;
                            });
                        tooltip = d3.select('#tooltip');
                        tooltip.style('display', 'block');
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', .9);
                        tooltip.html(`<p style='color: #1e81b0'>${indicator === "H_ITV" ? "TV" : indicator === "H_IMPH" ? "Mobile" : "PC"}</p>
                            <p style='color: #1e81b0'>${d.key}</p>
                            <p style='color: #1e81b0'>${meanValue.toFixed(2)}%</p>`)
                            .style('left', (event.pageX) + 'px')
                            .style('top', (event.pageY - 28) + 'px');
                    })
                    .on("mouseout", function (d) {
                        d3.selectAll('.area')
                            .transition()
                            .duration(200)
                            .attr("opacity", 0.7)
                            .attr("stroke-width", 1);

                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 0);
                    })
            });
            setLoading(false);
        })
    }, []);

    return (
        <>
            {loading && <Loader />}
            <div style={{ display: loading ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '80vw', margin: '0 auto' }} ref={ref}>
                <svg></svg>
            </div>
            <div id='tooltip' className='absolute bg-white border border-gray-300 shadow-lg p-2 rounded-md opacity-0 hidden' onMouseLeave={() => d3.select('#tooltip').style('display', 'none')}></div>
        </>
    )
}

export default Test