import React, { useEffect, useRef, useState } from 'react';
import { colorScheme } from '../Config';
import * as d3 from 'd3';
import Loader from '../Loader';
import Tooltip from '../Tooltip';

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
        height: 500,
        margin: { top: 50, right: 30, bottom: 50, left: 60 },
    });
    const [loading, setLoading] = useState(true);

    const [showDataPreparation, setShowDataPreparation] = useState(false);

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });


    useEffect(() => {
        setLoading(true);
        // clean the container
        d3.select(ref.current).selectAll('svg').remove();

        // set the dimensions and margins of the graph
        const { width, height, margin } = dimensions;

        // append the svg object to the body of the page
        var svg = d3.select(ref.current)
            .append("svg")
            .attr("width", dimensions.width + margin.left + margin.right)
            .attr("height", dimensions.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");

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
            //var tooltip = d3.select("#tooltip");

            // Add X axis
            var x = d3.scaleLinear()
                .domain([-10, 120])
                .range([0, width]);

            var spacing = height / n;

            svg.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0," + (height) + ")")
                .call(d3.axisBottom(x).tickValues([0, 25, 50, 75, 100]).tickSize(-height))
                .selectAll("text")
                .style("font-size", "16px")
                .style("font-weight", "700")

            svg.selectAll(".xAxis .tick text")
                .attr("y", 10);

            // Add X axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height + 40)
                .style("font-size", "16px")
                .style("font-weight", "700")
                .style("fill", "#fff")
                .text("Probability (%)");

            // Create a Y scale for densities
            var y = d3.scaleLinear()
                .domain([0, yMax / 1000])
                .range([spacing, 0]);

            // Create the Y axis for names
            var yName = d3.scaleBand()
                .domain(categories)
                .range([1, height])
                .paddingInner(1)

            svg.append("g")
                .attr("class", "yAxis")
                .call(d3.axisLeft(yName).tickSize(0))
                .selectAll("text")
                .style("font-size", "16px")
                .style("font-weight", "700")
            
            svg.selectAll(".yAxis .domain").remove();
            svg.selectAll(".xAxis .domain").remove();




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
                        setTooltipContent(`<p style='color: #1e81b0'>Device: ${indicator === "H_ITV" ? "TV" : indicator === "H_IMPH" ? "Mobile" : "PC"}</p>
                            <p style='color: #1e81b0'>Year: ${d.key}</p>
                            <p style='color: #1e81b0'>Mean value: ${meanValue.toFixed(2)}%</p>`);
                        setTooltipPosition({ x: event.pageX, y: event.pageY });
                        setTooltipVisible(true);
                    })
                    .on("mouseout", function (d) {
                        d3.selectAll('.area')
                            .transition()
                            .duration(200)
                            .attr("opacity", 0.7)
                            .attr("stroke-width", 1);
                        setTooltipVisible(false);
                    })
            });
            setLoading(false);
        })
    }, []);

    return (
        <>
            <div className='w-screen mt-10 plotsection'>
                <h1 className='plottitle'> The Evolution of Internet Devices</h1>
                <p className='plotintro'>Internet use is strongly correlated with the tool to do so. Below we can see the difference between 3 devices (TV, PC, and cell phone) using a ridgline that allows us to see the different probability distrubutions in usage. Unfortunately, the data are not very up to date.</p>
                {loading && <Loader />}
                <div className='flex justify-center items-center w-full h-full -ml-10' style={{ display: loading ? 'none' : 'flex' }}>
                    <div ref={ref} className='w-fit'></div>
                </div>
                <Tooltip
                    content={<div dangerouslySetInnerHTML={{ __html: tooltipContent }} />}
                    isVisible={tooltipVisible}
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                    className={'text-center'}
                />
                <p className='plotexpl'>Using this ridgeline, we see how the most widely used method of accessing the Internet, shortly after its popularity (late 1990s) until the early 2010s of the new millennium, was the PC. To date, the doubt is that the most used method is via mobile, in the graph still a marginal method. Unfortunately, the data are not available.</p>
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className={`${showDataPreparation ? 'h-[100px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                        <p id='explain-1' className='w-[80%] text-left mx-auto'>
                            To create this chart we have this <a href="https://doi.org/10.2908/ISOC_CI_ID_H" className='underline underline-offset-4 cursor-pointer'>dataset</a> made available by eurostat. We selected 3 indicators (<code>H_IMPH , H_IPC, H_ITV</code>) keeping the ones with fewer missing values, comuments always abundant. We replaced the <code>:</code> character used by eurostat to indicate missing values with <code>NaN</code>. <br />
                            For the rest we took all available countries and the same for years.
                        </p>
                    </div>
                    <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
                </div>
            </div>
        </>
    )
}

export default Test