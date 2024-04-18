import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataFile from '../../data/Area_chart.json';
import { getColor } from '../Config';
import { mapstate, map_size_emp, map_size_emp_to_number } from '../MapState';

const processData = (data) => {
    const processedData = [];

    const time_period_set = new Set(data.map(d => d.TIME_PERIOD));
    const geo_set = new Set(data.map(d => d.geo));
    const indic_is = 'E_AESELL';

    time_period_set.forEach(time_period => {
        geo_set.forEach(geo => {
            var obj = {
                TIME_PERIOD: time_period,
                indic_is: indic_is,
                geo: geo
            };
            data.filter(d => d.TIME_PERIOD === time_period && d.indic_is === indic_is && d.geo === geo)
                .forEach(d => {
                    obj[d.size_emp] = d.OBS_VALUE;
                });
            processedData.push(obj);
        });
    });

    return processedData;
};

function StackedAreaChart() {
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 1000,
        margin: { top: 0, right: 25, bottom: 20, left: 100 },
    });

    const [indic_is, setIndicIs] = useState('E_AESBHM');
    const [geo, setGeo] = useState('DE');
    var data = processData(dataFile);

    useEffect(() => {
        setLoading(true);
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        var tmp = data.filter(d => d.geo === geo);
        // sort by time period
        tmp.sort((a, b) => a.TIME_PERIOD - b.TIME_PERIOD);
        const size_ent = Object.keys(data[0]).slice(3);
        const stackedData = d3.stack()
            .keys(size_ent)
            (tmp)
        // replace NaN with 0 in stackedData
        stackedData.forEach(d => {
            d.forEach(e => {
                if (isNaN(e[0])) {
                    e[0] = 0;
                }
                if (isNaN(e[1])) {
                    e[1] = 0;
                }
            });
        });


        const svg = container
            .append('svg')
            .attr('id', 'stacked_area_chart')
            .attr('width', dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr('height', dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

        const x_domain = d3.extent(dataFile, d => d.TIME_PERIOD);

        const x = d3.scaleLinear()
            .domain(x_domain)
            .range([0, dimensions.width - dimensions.margin.right - dimensions.margin.left]);

        const y = d3.scaleLinear()
            .domain([0, 1000])
            .range([dimensions.height - dimensions.margin.top - dimensions.margin.bottom, 0]);

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

        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .attr("x", 0)
            .attr("y", 0);

        var brush = d3.brushX()
            .extent([[0, 0], [dimensions.width, dimensions.height]])
            .on("end", updateChart)

        var areaChart = svg.append('g')
            .attr("clip-path", "url(#clip)")

        var area = d3.area()
            .x(function (d) { return x(d.data.TIME_PERIOD); })
            .y0(function (d) { return y(d[0]); })
            .y1(function (d) { return y(d[1]); })

        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", function (d) { return "myArea " + d.key })
            .style("fill", function (d) { return getColor(map_size_emp_to_number(d.key), 0, 100); })
            .attr("d", area)

        areaChart
            .append("g")
            .attr("class", "brush")
            .call(brush);

        var idleTimeout
        function idled() { idleTimeout = null; }

        function updateChart() {

            extent = d3.event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain(d3.extent(tmp, function (d) { return d.TIME_PERIOD; }))
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
            areaChart
                .selectAll("path")
                .transition().duration(1000)
                .attr("d", area)
        }

        var highlight = function (d) {
            // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
            d3.select("." + d).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = function (d) {
            d3.selectAll(".myArea").style("opacity", 1)
        }

        /*
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
        */
       setLoading(false);
    }, []);
    return (
        <div className="w-screen mb-64">
            <h1>Stacked Area Chart</h1>
            <div ref={ref}></div>
        </div>
    );
}
export default StackedAreaChart;